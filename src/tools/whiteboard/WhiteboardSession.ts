import type { BoardPoint } from '@/tools/whiteboard/protocol';
import {
  parseWhiteboardWire,
  serializeWhiteboardWire,
  type WhiteboardWireMessage,
} from '@/tools/whiteboard/protocol';

export type BoardStroke = {
  id: string;
  color: string;
  width: number;
  points: BoardPoint[];
  author: 'local' | 'remote';
};

export type WhiteboardSessionHandlers = {
  onStrokesChange: (strokes: BoardStroke[]) => void;
  onPeerLeave: () => void;
};

export class WhiteboardSession {
  private strokes: BoardStroke[] = [];
  private disposed = false;
  private readonly onMessage: (ev: MessageEvent) => void;

  constructor(
    private readonly channel: RTCDataChannel,
    private readonly handlers: WhiteboardSessionHandlers,
  ) {
    this.onMessage = (ev) => this.routeMessage(ev);
    channel.addEventListener('message', this.onMessage);
  }

  getStrokes(): BoardStroke[] {
    return this.strokes;
  }

  beginStroke(id: string, color: string, width: number, point: BoardPoint): void {
    const stroke: BoardStroke = {
      id,
      color,
      width,
      points: [point],
      author: 'local',
    };
    this.strokes.push(stroke);
    this.emit();
    this.send({ type: 'stroke', id, color, width, points: [point] });
  }

  appendPoints(id: string, points: BoardPoint[]): void {
    if (points.length === 0) return;
    const stroke = this.strokes.find((s) => s.id === id);
    if (stroke) stroke.points.push(...points);
    this.emit();
    this.send({ type: 'stroke_seg', id, points });
  }

  endStroke(id: string): void {
    this.send({ type: 'stroke_end', id });
  }

  clearBoard(): void {
    this.strokes = [];
    this.emit();
    this.send({ type: 'clear' });
  }

  undoLastLocal(): void {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      if (this.strokes[i].author === 'local') {
        const removed = this.strokes[i];
        this.strokes.splice(i, 1);
        this.emit();
        this.send({ type: 'undo', strokeId: removed.id });
        return;
      }
    }
  }

  leave(): void {
    if (this.disposed) return;
    if (this.channel.readyState === 'open') {
      try {
        this.channel.send(serializeWhiteboardWire({ type: 'leave' }));
      } catch {
        // ignore
      }
    }
    this.dispose();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.channel.removeEventListener('message', this.onMessage);
    this.strokes = [];
  }

  private send(msg: WhiteboardWireMessage): void {
    if (this.disposed || this.channel.readyState !== 'open') return;
    this.channel.send(serializeWhiteboardWire(msg));
  }

  private emit(): void {
    this.handlers.onStrokesChange([...this.strokes]);
  }

  private routeMessage(ev: MessageEvent): void {
    if (this.disposed || typeof ev.data !== 'string') return;
    const msg = parseWhiteboardWire(ev.data);
    if (!msg) return;
    this.handleWire(msg);
  }

  private handleWire(msg: WhiteboardWireMessage): void {
    if (msg.type === 'stroke') {
      if (this.strokes.some((s) => s.id === msg.id)) return;
      this.strokes.push({
        id: msg.id,
        color: msg.color,
        width: msg.width,
        points: [...msg.points],
        author: 'remote',
      });
      this.emit();
      return;
    }
    if (msg.type === 'stroke_seg') {
      const stroke = this.strokes.find((s) => s.id === msg.id);
      if (stroke) stroke.points.push(...msg.points);
      this.emit();
      return;
    }
    if (msg.type === 'stroke_end') {
      return;
    }
    if (msg.type === 'clear') {
      this.strokes = [];
      this.emit();
      return;
    }
    if (msg.type === 'undo') {
      this.strokes = this.strokes.filter((s) => s.id !== msg.strokeId);
      this.emit();
      return;
    }
    if (msg.type === 'leave') {
      this.handlers.onPeerLeave();
      this.dispose();
    }
  }
}
