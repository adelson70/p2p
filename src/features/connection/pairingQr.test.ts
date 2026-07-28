import { describe, expect, it } from 'vitest';
import {
  encodeSignalingForQr,
  decodeSignalingFromQr,
  parseSignalingInput,
} from '@/features/connection/pairingQr';
import { createSignalingPacket, serializeSignaling } from '@/features/connection/signalingManual';

describe('pairingQr', () => {
  it('round-trips invite payload', () => {
    const packet = createSignalingPacket(
      'offer',
      { type: 'offer', sdp: 'v=0' },
      [{ candidate: 'c' }],
      '1234-5678',
    );
    const encoded = encodeSignalingForQr(packet);
    const decoded = decodeSignalingFromQr(encoded);
    expect(decoded.role).toBe('offer');
    expect(decoded.roomCode).toBe('1234-5678');
    expect(decoded.sdp.sdp).toBe('v=0');
  });

  it('parses plain JSON clipboard', () => {
    const packet = createSignalingPacket('answer', { type: 'answer', sdp: 'a' }, []);
    const parsed = parseSignalingInput(serializeSignaling(packet));
    expect(parsed.role).toBe('answer');
  });

  it('rejects room code only paste', () => {
    expect(() => parseSignalingInput('1234-5678')).toThrow(/Unrecognized format/i);
  });
});
