import { createRtcConfiguration } from './rtcConfig';

export const DATA_CHANNEL_LABEL = 'privatedrop';
export const CALL_CONTROL_CHANNEL = 'privatecall-ctrl';
export const CHAT_DATA_CHANNEL = 'privatechat';
export const WHITEBOARD_DATA_CHANNEL = 'privateboard';

/** @deprecated use createRtcConfiguration() */
export const DEFAULT_RTC_CONFIG: RTCConfiguration = createRtcConfiguration();

export interface PeerHandlers {
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onDataChannel?: (channel: RTCDataChannel) => void;
}

export function createPeerConnection(handlers: PeerHandlers): RTCPeerConnection {
  const pc = new RTCPeerConnection(createRtcConfiguration());

  pc.onicecandidate = (ev) => {
    if (ev.candidate) {
      handlers.onIceCandidate(ev.candidate.toJSON());
    }
  };

  pc.onconnectionstatechange = () => {
    handlers.onConnectionStateChange(pc.connectionState);
  };

  pc.ondatachannel = (ev) => {
    configureDataChannel(ev.channel);
    handlers.onDataChannel?.(ev.channel);
  };

  return pc;
}

export function configureDataChannel(channel: RTCDataChannel): void {
  channel.binaryType = 'arraybuffer';
}

export function createCallControlChannel(pc: RTCPeerConnection): RTCDataChannel {
  return pc.createDataChannel(CALL_CONTROL_CHANNEL, { ordered: true });
}

export function createOutboundDataChannel(pc: RTCPeerConnection): RTCDataChannel {
  const channel = pc.createDataChannel(DATA_CHANNEL_LABEL, { ordered: true });
  configureDataChannel(channel);
  return channel;
}

export function createChatDataChannel(pc: RTCPeerConnection): RTCDataChannel {
  const channel = pc.createDataChannel(CHAT_DATA_CHANNEL, { ordered: true });
  configureDataChannel(channel);
  return channel;
}

export function createWhiteboardDataChannel(pc: RTCPeerConnection): RTCDataChannel {
  const channel = pc.createDataChannel(WHITEBOARD_DATA_CHANNEL, { ordered: true });
  configureDataChannel(channel);
  return channel;
}

export async function createOffer(pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
}

export async function acceptOffer(
  pc: RTCPeerConnection,
  offer: RTCSessionDescriptionInit,
): Promise<RTCSessionDescriptionInit> {
  await pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
}

export async function acceptAnswer(
  pc: RTCPeerConnection,
  answer: RTCSessionDescriptionInit,
): Promise<void> {
  await pc.setRemoteDescription(answer);
}

export async function addIceCandidates(
  pc: RTCPeerConnection,
  candidates: RTCIceCandidateInit[],
): Promise<void> {
  for (const c of candidates) {
    try {
      await pc.addIceCandidate(c);
    } catch {
      // ICE may arrive before remote description is set
    }
  }
}
