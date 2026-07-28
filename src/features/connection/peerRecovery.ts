import { addIceCandidates } from './webrtc';
import { createSignalingPacket, type SignalingPacket } from './signalingManual';

/** Grace period while ICE/WebRTC is disconnected before ending the session. */
export const PEER_DISCONNECTED_GRACE_MS = 30_000;

const ICE_RESTART_DELAY_MS = 1_000;

export interface PeerRecoveryDeps {
  getPc: () => RTCPeerConnection | null;
  isOfferer: () => boolean;
  isEnded: () => boolean;
  clearIceBuffer: () => void;
  getIceBuffer: () => RTCIceCandidateInit[];
  onPhaseReconnecting: () => void;
  onPhaseConnected: () => void;
  onPhaseConnecting: () => void;
  onRecoveryFailed: () => void;
  sendSignal: (packet: SignalingPacket) => void;
  waitIceGathering: (pc: RTCPeerConnection) => Promise<void>;
}

export class PeerRecoverySession {
  private graceTimer: number | null = null;
  private iceRestartTimer: number | null = null;
  private iceRestartInFlight = false;

  constructor(private readonly deps: PeerRecoveryDeps) {}

  handleConnectionState(state: RTCPeerConnectionState): void {
    if (this.deps.isEnded()) return;

    if (state === 'connected') {
      this.clearGrace();
      this.clearIceRestartTimer();
      this.deps.onPhaseConnected();
      return;
    }

    if (state === 'connecting' || state === 'new') {
      this.deps.onPhaseConnecting();
      return;
    }

    if (state === 'disconnected') {
      this.deps.onPhaseReconnecting();
      this.scheduleGrace();
      if (this.deps.isOfferer()) this.scheduleIceRestart();
      return;
    }

    if (state === 'failed') {
      this.deps.onPhaseReconnecting();
      this.scheduleGrace();
      if (this.deps.isOfferer()) {
        void this.runIceRestart();
      }
      return;
    }
  }

  async handleRemoteSignal(packet: SignalingPacket): Promise<void> {
    if (this.deps.isEnded()) return;
    const pc = this.deps.getPc();
    if (!pc) return;

    try {
      if (packet.role === 'offer') {
        this.deps.clearIceBuffer();
        await pc.setRemoteDescription(packet.sdp);
        await addIceCandidates(pc, packet.ice);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await this.deps.waitIceGathering(pc);
        const local = pc.localDescription;
        if (!local) return;
        this.deps.sendSignal(createSignalingPacket('answer', local, [...this.deps.getIceBuffer()]));
      } else {
        await pc.setRemoteDescription(packet.sdp);
        await addIceCandidates(pc, packet.ice);
      }
    } catch {
      // Renegotiation can fail if descriptions are out of sync; grace timer may still recover.
    }
  }

  dispose(): void {
    this.clearGrace();
    this.clearIceRestartTimer();
    this.iceRestartInFlight = false;
  }

  private scheduleGrace(): void {
    if (this.graceTimer !== null) return;
    this.graceTimer = window.setTimeout(() => {
      this.graceTimer = null;
      if (!this.deps.isEnded()) this.deps.onRecoveryFailed();
    }, PEER_DISCONNECTED_GRACE_MS);
  }

  private clearGrace(): void {
    if (this.graceTimer !== null) {
      window.clearTimeout(this.graceTimer);
      this.graceTimer = null;
    }
  }

  private scheduleIceRestart(): void {
    if (this.iceRestartTimer !== null) return;
    this.iceRestartTimer = window.setTimeout(() => {
      this.iceRestartTimer = null;
      void this.runIceRestart();
    }, ICE_RESTART_DELAY_MS);
  }

  private clearIceRestartTimer(): void {
    if (this.iceRestartTimer !== null) {
      window.clearTimeout(this.iceRestartTimer);
      this.iceRestartTimer = null;
    }
  }

  private async runIceRestart(): Promise<void> {
    if (this.iceRestartInFlight || this.deps.isEnded() || !this.deps.isOfferer()) return;
    const pc = this.deps.getPc();
    if (!pc) return;

    this.iceRestartInFlight = true;
    try {
      this.deps.clearIceBuffer();
      const offer = await pc.createOffer({ iceRestart: true });
      await pc.setLocalDescription(offer);
      await this.deps.waitIceGathering(pc);
      const local = pc.localDescription;
      if (!local) return;
      this.deps.sendSignal(createSignalingPacket('offer', local, [...this.deps.getIceBuffer()]));
    } catch {
      // Offerer may retry on next state change while grace is active.
    } finally {
      this.iceRestartInFlight = false;
    }
  }
}
