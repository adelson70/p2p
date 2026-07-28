const CHUNK_SIZE = 64 * 1024;

export interface ChunkMessage {
  type: 'chunk';
  index: number;
  buffer: ArrayBuffer;
}

self.onmessage = async (ev: MessageEvent<{ file: File; transferId: string }>) => {
  const { file, transferId } = ev.data;
  const reader = file.stream().getReader();
  let index = 0;
  let offset = 0;

  while (offset < file.size) {
    const { value, done } = await reader.read();
    if (done || !value) break;
    let pos = 0;
    while (pos < value.length) {
      const end = Math.min(pos + CHUNK_SIZE, value.length);
      const slice = value.buffer.slice(value.byteOffset + pos, value.byteOffset + end);
      const msg: ChunkMessage = { type: 'chunk', index, buffer: slice };
      self.postMessage(msg, { transfer: [slice] });
      index += 1;
      offset += end - pos;
      pos = end;
    }
  }

  self.postMessage({ type: 'complete', transferId, totalChunks: index });
};
