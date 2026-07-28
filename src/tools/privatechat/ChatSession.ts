import {
  FileReceiver,
  FileSender,
  type FileTransferProgress,
} from '@/tools/privatedrop/transfer';
import { parseControl } from '@/tools/privatedrop/protocol';
import {
  MAX_TEXT_LENGTH,
  parseChatWire,
  serializeChatWire,
  type ChatTextMessage,
  type ChatWireMessage,
} from '@/tools/privatechat/protocol';

export const CHAT_FILE_WARN_BYTES = 1024 * 1024 * 1024;

export function isImageMime(mime: string): boolean {
  return mime.startsWith('image/');
}

export function isVideoMime(mime: string): boolean {
  return mime.startsWith('video/');
}

export function isMediaMime(mime: string): boolean {
  return isImageMime(mime) || isVideoMime(mime);
}

export type ChatMessageItem =
  | {
      kind: 'text';
      id: string;
      body: string;
      sentAt: number;
      direction: 'out' | 'in';
    }
  | {
      kind: 'file';
      id: string;
      name: string;
      mimeType?: string;
      direction: 'out' | 'in';
      status: 'sending' | 'receiving' | 'done' | 'error';
      progress?: FileTransferProgress;
      file?: File;
      objectUrl?: string;
    };

export interface ChatSessionHandlers {
  onMessagesChange: (messages: ChatMessageItem[]) => void;
  onTypingChange: (peerTyping: boolean) => void;
  onPeerLeave: () => void;
  onFileReceived?: (file: File) => void;
}

export class ChatSession {
  private messages: ChatMessageItem[] = [];
  private seenIds = new Set<string>();
  private fileSender: FileSender | null = null;
  private fileReceiver: FileReceiver | null = null;
  private fileQueue: File[] = [];
  private sendingFiles = false;
  private disposed = false;
  private peerTyping = false;
  private onChannelMessage: (ev: MessageEvent) => void;

  constructor(
    private channel: RTCDataChannel,
    private handlers: ChatSessionHandlers,
  ) {
    this.fileSender = new FileSender(channel, (p) => this.updateFileProgress(p, 'out'), {
      attachListener: false,
    });
    this.fileReceiver = new FileReceiver(
      channel,
      {
        onFileComplete: (file, transferId) => this.onIncomingFileComplete(file, transferId),
        onProgress: (p) => this.updateFileProgress(p, 'in'),
      },
      { attachListener: false },
    );

    this.onChannelMessage = (ev) => this.routeMessage(ev);
    channel.addEventListener('message', this.onChannelMessage);
  }

  getMessages(): ChatMessageItem[] {
    return this.messages;
  }

  getChannel(): RTCDataChannel {
    return this.channel;
  }

  setHandlers(handlers: ChatSessionHandlers): void {
    if (this.disposed) return;
    this.handlers = handlers;
    handlers.onMessagesChange([...this.messages]);
    handlers.onTypingChange(this.peerTyping);
  }

  sendText(body: string): void {
    const trimmed = body.trim();
    if (!trimmed || this.channel.readyState !== 'open') return;
    if (trimmed.length > MAX_TEXT_LENGTH) {
      throw new Error(`Message too long (max ${MAX_TEXT_LENGTH} characters).`);
    }
    const msg: ChatTextMessage = {
      type: 'text',
      id: crypto.randomUUID(),
      body: trimmed,
      sentAt: Date.now(),
    };
    this.channel.send(serializeChatWire(msg));
    this.appendText(msg, 'out');
  }

  sendTyping(active: boolean): void {
    if (this.channel.readyState !== 'open') return;
    this.channel.send(serializeChatWire({ type: 'typing', active }));
  }

  leave(): void {
    if (this.disposed) return;
    if (this.channel.readyState === 'open') {
      try {
        this.channel.send(serializeChatWire({ type: 'leave' }));
      } catch {
        // ignore
      }
    }
    this.dispose();
  }

  queueFiles(files: File[]): void {
    for (const f of files) {
      if (f.size > CHAT_FILE_WARN_BYTES) {
        throw new Error('File is very large; consider PrivateDrop for huge transfers.');
      }
      this.fileQueue.push(f);
    }
    void this.drainFileQueue();
  }

  private async drainFileQueue(): Promise<void> {
    if (this.sendingFiles || !this.fileSender) return;
    this.sendingFiles = true;
    try {
      while (this.fileQueue.length > 0) {
        const file = this.fileQueue.shift()!;
        const id = crypto.randomUUID();
        const mimeType = file.type || 'application/octet-stream';
        const objectUrl = isMediaMime(mimeType) ? URL.createObjectURL(file) : undefined;
        this.messages.push({
          kind: 'file',
          id,
          name: file.name,
          mimeType,
          direction: 'out',
          status: 'sending',
          objectUrl,
          file,
          progress: { transferId: id, name: file.name, sent: 0, total: file.size },
        });
        this.emitMessages();
        await this.fileSender.sendFiles([file], [id]);
        const item = this.messages.find((m) => m.kind === 'file' && m.id === id);
        if (item?.kind === 'file') {
          item.status = 'done';
          item.progress = undefined;
        }
        this.emitMessages();
      }
    } catch {
      const last = [...this.messages].reverse().find((m) => m.kind === 'file' && m.status === 'sending');
      if (last?.kind === 'file') last.status = 'error';
      this.emitMessages();
    } finally {
      this.sendingFiles = false;
      if (this.fileQueue.length > 0) void this.drainFileQueue();
    }
  }

  private routeMessage(ev: MessageEvent): void {
    if (this.disposed) return;
    if (typeof ev.data === 'string') {
      const chat = parseChatWire(ev.data);
      if (chat) {
        this.handleChatWire(chat);
        return;
      }
      this.fileSender?.handleControlString(ev.data);
      try {
        const control = parseControl(ev.data);
        if (control.type === 'meta') {
          const id = control.transferId;
          if (!this.messages.some((m) => m.kind === 'file' && m.id === id)) {
            this.messages.push({
              kind: 'file',
              id,
              name: control.name,
              mimeType: control.mime,
              direction: 'in',
              status: 'receiving',
              progress: {
                transferId: id,
                name: control.name,
                sent: 0,
                total: control.size,
              },
            });
            this.emitMessages();
          }
        }
        this.fileReceiver?.handleChannelMessage(this.channel, ev);
      } catch {
        // not file control
      }
      return;
    }
    this.fileReceiver?.handleChannelMessage(this.channel, ev);
  }

  private handleChatWire(msg: ChatWireMessage): void {
    if (msg.type === 'text') {
      if (this.seenIds.has(msg.id)) return;
      this.seenIds.add(msg.id);
      this.appendText(msg, 'in');
      return;
    }
    if (msg.type === 'typing') {
      this.peerTyping = msg.active;
      this.handlers.onTypingChange(msg.active);
      return;
    }
    if (msg.type === 'leave') {
      this.handlers.onPeerLeave();
      this.dispose();
    }
  }

  private appendText(msg: ChatTextMessage, direction: 'out' | 'in'): void {
    if (direction === 'out') this.seenIds.add(msg.id);
    this.messages.push({
      kind: 'text',
      id: msg.id,
      body: msg.body,
      sentAt: msg.sentAt,
      direction,
    });
    this.emitMessages();
  }

  private updateFileProgress(p: FileTransferProgress, direction: 'out' | 'in'): void {
    const item = this.messages.find(
      (m) => m.kind === 'file' && (m.id === p.transferId || m.progress?.transferId === p.transferId),
    );
    if (item?.kind === 'file') {
      item.progress = p;
      item.status = direction === 'out' ? 'sending' : 'receiving';
      this.emitMessages();
    }
  }

  private onIncomingFileComplete(file: File, transferId: string): void {
    const item = this.messages.find((m) => m.kind === 'file' && m.id === transferId);
    if (item?.kind === 'file') {
      item.status = 'done';
      item.file = file;
      item.mimeType = file.type || item.mimeType;
      item.objectUrl = URL.createObjectURL(file);
      item.progress = undefined;
    }
    this.emitMessages();
    this.handlers.onFileReceived?.(file);
  }

  private emitMessages(): void {
    this.handlers.onMessagesChange([...this.messages]);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.channel.removeEventListener('message', this.onChannelMessage);
    this.fileSender?.dispose();
    this.fileReceiver?.dispose();
    for (const m of this.messages) {
      if (m.kind === 'file' && m.objectUrl) URL.revokeObjectURL(m.objectUrl);
    }
  }
}
