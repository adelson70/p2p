/**
 * Public STUN servers (no TURN). Multiple providers improve odds of srflx/reflexive
 * candidates across different NAT topologies. All tools share this list.
 */
/** Keep under five entries — browsers warn that more STUN/TURN servers slow ICE. */
export const PUBLIC_STUN_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
];

/** Default ICE gathering wait when exchanging full SDP manually (no trickle). */
export const ICE_GATHER_TIMEOUT_MS = 2_000;

export function createRtcConfiguration(): RTCConfiguration {
  return {
    iceServers: PUBLIC_STUN_SERVERS,
    /** Pre-gather candidates before offer/answer when supported. */
    iceCandidatePoolSize: 4,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
    iceTransportPolicy: 'all',
  };
}
