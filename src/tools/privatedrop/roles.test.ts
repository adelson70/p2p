import { describe, expect, it } from 'vitest';
import { createSignalingPacket } from '@/features/connection/signalingManual';
import {
  assertSignalingPacketRole,
  fileRoleFromSignalingRole,
  signalingRoleForFileRole,
} from '@/tools/privatedrop/roles';

describe('PrivateDrop roles', () => {
  it('maps file sender to WebRTC offer', () => {
    expect(signalingRoleForFileRole('file-sender')).toBe('offer');
    expect(signalingRoleForFileRole('file-receiver')).toBe('answer');
  });

  it('maps signaling roles back to file roles', () => {
    expect(fileRoleFromSignalingRole('offer')).toBe('file-sender');
    expect(fileRoleFromSignalingRole('answer')).toBe('file-receiver');
  });

  it('rejects pasting answer on invite step', () => {
    const answer = createSignalingPacket('answer', { type: 'answer', sdp: 'x' }, []);
    expect(() => assertSignalingPacketRole(answer, 'offer')).toThrow(/invite/i);
  });

  it('rejects pasting offer on response step', () => {
    const offer = createSignalingPacket('offer', { type: 'offer', sdp: 'x' }, []);
    expect(() => assertSignalingPacketRole(offer, 'answer')).toThrow(/response/i);
  });
});
