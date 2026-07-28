export type BoardPoint = [number, number];

export type StrokeStartWire = {
  type: 'stroke';
  id: string;
  color: string;
  width: number;
  points: BoardPoint[];
};

export type StrokeSegWire = {
  type: 'stroke_seg';
  id: string;
  points: BoardPoint[];
};

export type StrokeEndWire = {
  type: 'stroke_end';
  id: string;
};

export type ClearWire = { type: 'clear' };

export type UndoWire = { type: 'undo'; strokeId: string };

export type LeaveWire = { type: 'leave' };

export type WhiteboardWireMessage =
  | StrokeStartWire
  | StrokeSegWire
  | StrokeEndWire
  | ClearWire
  | UndoWire
  | LeaveWire;

const WB_TYPES = new Set([
  'stroke',
  'stroke_seg',
  'stroke_end',
  'clear',
  'undo',
  'leave',
]);

function isFinite01(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1;
}

function parsePoint(p: unknown): BoardPoint | null {
  if (!Array.isArray(p) || p.length !== 2) return null;
  if (!isFinite01(p[0]) || !isFinite01(p[1])) return null;
  return [p[0], p[1]];
}

function parsePoints(arr: unknown): BoardPoint[] | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const out: BoardPoint[] = [];
  for (const p of arr) {
    const pt = parsePoint(p);
    if (!pt) return null;
    out.push(pt);
  }
  return out;
}

export function isWhiteboardWireMessage(msg: { type: string }): msg is WhiteboardWireMessage {
  return WB_TYPES.has(msg.type);
}

export function parseWhiteboardWire(raw: string): WhiteboardWireMessage | null {
  try {
    const data = JSON.parse(raw) as { type: string };
    if (!isWhiteboardWireMessage(data)) return null;

    if (data.type === 'clear' || data.type === 'leave') return data;

    if (data.type === 'undo') {
      const strokeId = (data as UndoWire).strokeId;
      if (typeof strokeId !== 'string' || !strokeId) return null;
      return { type: 'undo', strokeId };
    }

    if (data.type === 'stroke_end') {
      const id = (data as StrokeEndWire).id;
      if (typeof id !== 'string' || !id) return null;
      return { type: 'stroke_end', id };
    }

    if (data.type === 'stroke') {
      const m = data as StrokeStartWire;
      if (typeof m.id !== 'string' || !m.id) return null;
      if (typeof m.color !== 'string' || !m.color) return null;
      if (typeof m.width !== 'number' || !Number.isFinite(m.width) || m.width <= 0) return null;
      const points = parsePoints(m.points);
      if (!points) return null;
      return { type: 'stroke', id: m.id, color: m.color, width: m.width, points };
    }

    if (data.type === 'stroke_seg') {
      const m = data as StrokeSegWire;
      if (typeof m.id !== 'string' || !m.id) return null;
      const points = parsePoints(m.points);
      if (!points) return null;
      return { type: 'stroke_seg', id: m.id, points };
    }
  } catch {
    // invalid JSON
  }
  return null;
}

export function serializeWhiteboardWire(msg: WhiteboardWireMessage): string {
  return JSON.stringify(msg);
}

/** Client coords → normalized 0..1 for wire transport. */
export function normalizePoint(clientX: number, clientY: number, rect: DOMRect): BoardPoint {
  const x = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
  const y = rect.height > 0 ? (clientY - rect.top) / rect.height : 0;
  return [Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y))];
}
