import type { SignalingPacket, SignalingRole } from './signalingManual';

export const RTC_SIGNAL_WIRE_TYPE = 'rtc-signal';

export type RtcSignalWireMessage = {
  type: typeof RTC_SIGNAL_WIRE_TYPE;
  role: SignalingRole;
  sdp: RTCSessionDescriptionInit;
  ice: RTCIceCandidateInit[];
};

export function signalingPacketFromWire(msg: RtcSignalWireMessage): SignalingPacket {
  return { v: 1, role: msg.role, sdp: msg.sdp, ice: msg.ice };
}

export function serializeRtcSignalWire(packet: SignalingPacket): string {
  const msg: RtcSignalWireMessage = {
    type: RTC_SIGNAL_WIRE_TYPE,
    role: packet.role,
    sdp: packet.sdp,
    ice: packet.ice,
  };
  return JSON.stringify(msg);
}

export function parseRtcSignalWire(raw: string): SignalingPacket | null {
  try {
    const data = JSON.parse(raw) as RtcSignalWireMessage;
    if (data.type !== RTC_SIGNAL_WIRE_TYPE || !data.sdp || !Array.isArray(data.ice)) return null;
    if (data.role !== 'offer' && data.role !== 'answer') return null;
    return signalingPacketFromWire(data);
  } catch {
    return null;
  }
}
