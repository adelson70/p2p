export type SignalingRole = 'offer' | 'answer';

export interface SignalingPacket {
  v: 1;
  role: SignalingRole;
  sdp: RTCSessionDescriptionInit;
  ice: RTCIceCandidateInit[];
  roomCode?: string;
}

export function createSignalingPacket(
  role: SignalingRole,
  sdp: RTCSessionDescriptionInit,
  ice: RTCIceCandidateInit[],
  roomCode?: string,
): SignalingPacket {
  return { v: 1, role, sdp, ice, roomCode };
}

export function serializeSignaling(packet: SignalingPacket): string {
  return JSON.stringify(packet);
}

export function parseSignaling(raw: string): SignalingPacket {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Invalid signaling JSON. Copy the full text from the other device.');
  }
  const packet = data as SignalingPacket;
  if (packet.v !== 1 || !packet.sdp || !Array.isArray(packet.ice)) {
    throw new Error('Invalid signaling packet');
  }
  if (packet.role !== 'offer' && packet.role !== 'answer') {
    throw new Error('Invalid signaling role');
  }
  return packet;
}

export async function copySignalingToClipboard(packet: SignalingPacket): Promise<void> {
  const { encodeSignalingForQr } = await import('./pairingQr');
  await navigator.clipboard.writeText(encodeSignalingForQr(packet));
}
