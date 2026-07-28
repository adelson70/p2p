import { describe, expect, it } from 'vitest';
import { isChatWireMessage, parseChatWire, isFileControlType } from '@/tools/privatechat/protocol';

describe('privatechat protocol', () => {
  it('parses text messages', () => {
    const raw = JSON.stringify({
      type: 'text',
      id: 'a',
      body: 'hello',
      sentAt: 1,
    });
    expect(parseChatWire(raw)).toEqual({
      type: 'text',
      id: 'a',
      body: 'hello',
      sentAt: 1,
    });
  });

  it('parses leave', () => {
    expect(parseChatWire('{"type":"leave"}')).toEqual({ type: 'leave' });
  });

  it('returns null for file meta JSON', () => {
    const raw = JSON.stringify({
      type: 'meta',
      transferId: 't',
      name: 'f.bin',
      size: 10,
      mime: 'application/octet-stream',
      chunkSize: 1024,
      totalChunks: 1,
    });
    expect(parseChatWire(raw)).toBeNull();
    expect(isFileControlType('meta')).toBe(true);
    expect(isChatWireMessage({ type: 'meta' })).toBe(false);
  });
});
