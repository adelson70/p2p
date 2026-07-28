import { describe, expect, it } from 'vitest';
import { createSignalingPacket } from '@/features/connection/signalingManual';
import { shrinkSignalingPacketForQr } from '@/features/connection/signalingForQr';

describe('signalingForQr', () => {
  it('drops duplicate ICE when SDP already lists candidates', () => {
    const packet = createSignalingPacket(
      'offer',
      { type: 'offer', sdp: 'v=0\na=candidate:1 1 udp 1 1.2.3.4 12345 typ host' },
      [{ candidate: 'candidate:2 1 udp 1 5.6.7.8 54321 typ srflx' }],
      '1111-2222',
    );
    const shrunk = shrinkSignalingPacketForQr(packet, 'normal');
    expect(shrunk.ice).toEqual([]);
    expect(shrunk.sdp.sdp).toContain('a=candidate:');
  });

  it('keeps a bounded set of ICE when SDP has no candidates', () => {
    const ice = Array.from({ length: 40 }, (_, i) => ({
      candidate: `candidate:${i} 1 udp 2130706431 192.168.0.${i % 250} ${50000 + i} typ host`,
      sdpMid: '0',
      sdpMLineIndex: 0,
    }));
    const packet = createSignalingPacket('offer', { type: 'offer', sdp: 'v=0' }, ice);
    const shrunk = shrinkSignalingPacketForQr(packet, 'normal');
    expect(shrunk.ice.length).toBeLessThanOrEqual(16);
  });
});
