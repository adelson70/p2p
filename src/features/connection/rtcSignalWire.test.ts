import { describe, expect, it } from 'vitest';
import { createSignalingPacket } from './signalingManual';
import { parseRtcSignalWire, serializeRtcSignalWire } from './rtcSignalWire';

describe('rtcSignalWire', () => {
  it('round-trips signaling over the wire envelope', () => {
    const packet = createSignalingPacket('offer', { type: 'offer', sdp: 'v=0' }, [{ candidate: 'a' }]);
    const raw = serializeRtcSignalWire(packet);
    const parsed = parseRtcSignalWire(raw);
    expect(parsed).toEqual(packet);
  });

  it('rejects non rtc-signal JSON', () => {
    expect(parseRtcSignalWire(JSON.stringify({ type: 'leave' }))).toBeNull();
  });
});
