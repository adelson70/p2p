import type { SignalingPacket, SignalingRole } from '@/features/connection/signalingManual';

/** File sender must be WebRTC offerer (creates the data channel). */
export type FileRole = 'file-sender' | 'file-receiver';

export function signalingRoleForFileRole(fileRole: FileRole): SignalingRole {
  return fileRole === 'file-sender' ? 'offer' : 'answer';
}

export function assertSignalingPacketRole(packet: SignalingPacket, expected: SignalingRole): void {
  if (packet.role !== expected) {
    throw new Error(
      `Expected signaling role "${expected}" but got "${packet.role}". ` +
        (expected === 'offer'
          ? 'The file sender must share their invite first; the receiver should paste that invite.'
          : 'Paste the receiver response here, not the original invite.'),
    );
  }
}

export function fileRoleFromSignalingRole(role: SignalingRole): FileRole {
  return role === 'offer' ? 'file-sender' : 'file-receiver';
}
