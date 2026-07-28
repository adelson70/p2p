export const CHUNK_SIZE = 64 * 1024;

export type ControlMessage =
  | {
      type: 'meta';
      transferId: string;
      name: string;
      size: number;
      mime: string;
      chunkSize: number;
      totalChunks: number;
    }
  | { type: 'ack'; transferId: string; index: number }
  | { type: 'done'; transferId: string }
  | { type: 'error'; transferId: string; message: string }
  | { type: 'cancel'; transferId: string };

const HEADER_LEN = 12;

export function encodeChunkFrame(transferId: string, index: number, data: ArrayBuffer): ArrayBuffer {
  const idBytes = new TextEncoder().encode(transferId.padEnd(36, ' ').slice(0, 36));
  const header = new ArrayBuffer(HEADER_LEN + 36);
  const view = new DataView(header);
  view.setUint32(0, index, true);
  view.setUint32(4, data.byteLength, true);
  view.setUint32(8, 36, true);
  new Uint8Array(header, 12, 36).set(idBytes);
  const out = new Uint8Array(HEADER_LEN + 36 + data.byteLength);
  out.set(new Uint8Array(header), 0);
  out.set(new Uint8Array(data), HEADER_LEN + 36);
  return out.buffer;
}

export function decodeChunkFrame(buffer: ArrayBuffer): {
  transferId: string;
  index: number;
  data: ArrayBuffer;
} {
  const view = new DataView(buffer);
  const index = view.getUint32(0, true);
  const length = view.getUint32(4, true);
  const idRaw = new TextDecoder().decode(new Uint8Array(buffer, 12, 36));
  const transferId = idRaw.trim();
  const data = buffer.slice(HEADER_LEN + 36, HEADER_LEN + 36 + length);
  return { transferId, index, data };
}

export function sendControl(channel: RTCDataChannel, msg: ControlMessage): void {
  if (channel.readyState !== 'open') {
    throw new Error('Data channel is not open');
  }
  channel.send(JSON.stringify(msg));
}

export function parseControl(data: string): ControlMessage {
  return JSON.parse(data) as ControlMessage;
}
