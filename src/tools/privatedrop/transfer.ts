import {
  CHUNK_SIZE,
  decodeChunkFrame,
  encodeChunkFrame,
  parseControl,
  sendControl,
  type ControlMessage,
} from './protocol';

export interface FileTransferProgress {
  transferId: string;
  name: string;
  sent: number;
  total: number;
}

const ACK_TIMEOUT_MS = 20_000;

export class FileSender {
  private pendingAcks = new Map<number, () => void>();
  private onMessageBound: (ev: MessageEvent) => void;

  constructor(
    private channel: RTCDataChannel,
    private onProgress: (p: FileTransferProgress) => void,
    options?: { attachListener?: boolean },
  ) {
    this.onMessageBound = this.onMessage;
    if (options?.attachListener !== false) {
      this.channel.addEventListener('message', this.onMessageBound);
    }
  }

  private onMessage = (ev: MessageEvent) => {
    if (typeof ev.data !== 'string') return;
    this.handleControlString(ev.data);
  };

  handleControlString(data: string): void {
    const msg = parseControl(data);
    if (msg.type === 'ack') {
      const resolve = this.pendingAcks.get(msg.index);
      resolve?.();
      this.pendingAcks.delete(msg.index);
    }
  }

  async sendFiles(files: File[], transferIds?: string[]): Promise<void> {
    for (let i = 0; i < files.length; i++) {
      await this.sendFile(files[i], transferIds?.[i]);
    }
  }

  private async sendFile(file: File, overrideTransferId?: string): Promise<void> {
    const transferId = overrideTransferId ?? crypto.randomUUID();
    const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
    sendControl(this.channel, {
      type: 'meta',
      transferId,
      name: file.name,
      size: file.size,
      mime: file.type || 'application/octet-stream',
      chunkSize: CHUNK_SIZE,
      totalChunks,
    });

    const worker = new Worker(new URL('../../workers/file-chunker.worker.ts', import.meta.url), {
      type: 'module',
    });

    let sent = 0;

    await new Promise<void>((resolve, reject) => {
      worker.onmessage = async (ev: MessageEvent) => {
        const data = ev.data;
        if (data.type === 'complete') {
          sendControl(this.channel, { type: 'done', transferId });
          worker.terminate();
          resolve();
          return;
        }
        if (data.type === 'chunk') {
          const index = data.index as number;
          const buffer = data.buffer as ArrayBuffer;
          const frame = encodeChunkFrame(transferId, index, buffer);
          await this.sendWithAck(index, frame);
          sent += buffer.byteLength;
          this.onProgress({ transferId, name: file.name, sent, total: file.size });
        }
      };
      worker.onerror = () => reject(new Error('Chunk worker failed'));
      worker.postMessage({ file, transferId });
    });
  }

  private sendWithAck(index: number, frame: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.pendingAcks.delete(index);
        reject(
          new Error(
            'Peer did not acknowledge data. Finish pairing on both devices or check firewall/NAT.',
          ),
        );
      }, ACK_TIMEOUT_MS);

      this.pendingAcks.set(index, () => {
        window.clearTimeout(timer);
        resolve();
      });

      if (this.channel.readyState !== 'open') {
        window.clearTimeout(timer);
        this.pendingAcks.delete(index);
        reject(new Error('Data channel is not open'));
        return;
      }

      try {
        this.channel.send(frame);
      } catch (err) {
        window.clearTimeout(timer);
        this.pendingAcks.delete(index);
        reject(err instanceof Error ? err : new Error('Send failed'));
      }
    });
  }

  dispose(): void {
    this.channel.removeEventListener('message', this.onMessageBound);
  }
}

export class FileReceiver {
  private buffers = new Map<
    string,
    { chunks: Map<number, ArrayBuffer>; meta?: Extract<ControlMessage, { type: 'meta' }> }
  >();
  private onMessageBound: (ev: MessageEvent) => void;

  constructor(
    private channel: RTCDataChannel,
    private handlers: {
      onFileComplete: (file: File, transferId: string) => void;
      onProgress: (p: FileTransferProgress) => void;
    },
    options?: { attachListener?: boolean },
  ) {
    this.onMessageBound = (ev) => this.handleChannelMessage(this.channel, ev);
    if (options?.attachListener !== false) {
      channel.addEventListener('message', this.onMessageBound);
    }
  }

  handleChannelMessage(channel: RTCDataChannel, ev: MessageEvent): void {
    if (typeof ev.data === 'string') {
      const msg = parseControl(ev.data);
      if (msg.type === 'meta') {
        this.buffers.set(msg.transferId, { chunks: new Map(), meta: msg });
      }
      return;
    }

    const { transferId, index, data } = decodeChunkFrame(ev.data as ArrayBuffer);
    const entry = this.buffers.get(transferId);
    if (!entry?.meta) return;
    entry.chunks.set(index, data);
    sendControl(channel, { type: 'ack', transferId, index });

    const received = Array.from(entry.chunks.values()).reduce((a, b) => a + b.byteLength, 0);
    this.handlers.onProgress({
      transferId,
      name: entry.meta.name,
      sent: received,
      total: entry.meta.size,
    });

    if (entry.chunks.size >= entry.meta.totalChunks) {
      const ordered = Array.from({ length: entry.meta.totalChunks }, (_, i) => entry.chunks.get(i)!);
      const blob = new Blob(ordered, { type: entry.meta.mime });
      const file = new File([blob], entry.meta.name, { type: entry.meta.mime });
      this.handlers.onFileComplete(file, transferId);
      this.buffers.delete(transferId);
    }
  }

  dispose(): void {
    this.channel.removeEventListener('message', this.onMessageBound);
  }
}

async function saveReceivedFile(file: File): Promise<void> {
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (
        window as Window & {
          showSaveFilePicker: (o: {
            suggestedName: string;
            types?: { description: string; accept: Record<string, string[]> }[];
          }) => Promise<FileSystemFileHandle>;
        }
      ).showSaveFilePicker({
        suggestedName: file.name,
      });
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
      return;
    } catch {
      // user cancelled or unsupported
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
}

export { saveReceivedFile };
