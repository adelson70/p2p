import type { SignalingPacket } from './signalingManual';
import { createSignalingPacket } from './signalingManual';

type IceKind = 'host' | 'srflx' | 'prflx' | 'relay' | 'unknown';

function iceKind(candidate: string | undefined): IceKind {
  if (!candidate) return 'unknown';
  const match = candidate.match(/\btyp\s+(\w+)/);
  const typ = match?.[1];
  if (typ === 'host' || typ === 'srflx' || typ === 'prflx' || typ === 'relay') return typ;
  return 'unknown';
}

function dedupeKey(candidate: string | undefined): string {
  if (!candidate) return '';
  const parts = candidate.trim().split(/\s+/);
  return parts.slice(0, 8).join(' ');
}

function trimIce(
  candidates: RTCIceCandidateInit[],
  limits: Record<IceKind, number>,
  maxTotal: number,
): RTCIceCandidateInit[] {
  const order: IceKind[] = ['srflx', 'host', 'prflx', 'relay', 'unknown'];
  const sorted = [...candidates].sort(
    (a, b) => order.indexOf(iceKind(a.candidate)) - order.indexOf(iceKind(b.candidate)),
  );
  const counts: Partial<Record<IceKind, number>> = {};
  const seen = new Set<string>();
  const kept: RTCIceCandidateInit[] = [];

  for (const c of sorted) {
    if (kept.length >= maxTotal) break;
    const kind = iceKind(c.candidate);
    const used = counts[kind] ?? 0;
    if (used >= limits[kind]) continue;
    const key = dedupeKey(c.candidate);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    counts[kind] = used + 1;
    kept.push({
      candidate: c.candidate,
      sdpMid: c.sdpMid,
      sdpMLineIndex: c.sdpMLineIndex,
    });
  }
  return kept;
}

function sdpContainsCandidates(sdp: string | undefined): boolean {
  return !!sdp?.includes('a=candidate:');
}

/** Smaller signaling payloads for QR (clipboard keeps the full packet). */
export function shrinkSignalingPacketForQr(
  packet: SignalingPacket,
  level: 'normal' | 'aggressive',
): SignalingPacket {
  const sdpText = packet.sdp.sdp ?? '';
  if (sdpContainsCandidates(sdpText)) {
    return createSignalingPacket(packet.role, packet.sdp, [], packet.roomCode);
  }

  const limits =
    level === 'aggressive'
      ? { host: 1, srflx: 3, prflx: 0, relay: 0, unknown: 0 }
      : { host: 2, srflx: 5, prflx: 1, relay: 0, unknown: 1 };

  const maxTotal = level === 'aggressive' ? 8 : 16;
  const ice = trimIce(packet.ice, limits, maxTotal);
  return createSignalingPacket(packet.role, packet.sdp, ice, packet.roomCode);
}

export function qrShrinkVariants(packet: SignalingPacket): SignalingPacket[] {
  return [
    shrinkSignalingPacketForQr(packet, 'normal'),
    shrinkSignalingPacketForQr(packet, 'aggressive'),
  ];
}
