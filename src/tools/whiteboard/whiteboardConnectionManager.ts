import {
  addIceCandidates,
  applyRemoteAnswer,
  createOffer,
  createPeerConnection,
  createWhiteboardDataChannel,
  WHITEBOARD_DATA_CHANNEL,
  type PeerHandlers,
} from '@/features/connection/webrtc';
import {
  createSignalingPacket,
  type SignalingPacket,
  type SignalingRole,
} from '@/features/connection/signalingManual';
import { generateRoomCode, generateSessionId } from '@/features/connection/roomCode';
import { patchConnectionSession, resetConnectionSession } from '@/features/connection/connectionSession';
import { PeerRecoverySession } from '@/features/connection/peerRecovery';
import { parseRtcSignalWire, serializeRtcSignalWire } from '@/features/connection/rtcSignalWire';
import { assertSignalingPacketRole } from '@/tools/privatedrop/roles';
import { ICE_GATHER_TIMEOUT_MS } from '@/features/connection/rtcConfig';

export type BoardRole = 'host' | 'guest';

export class WhiteboardConnectionManager {
  private pc: RTCPeerConnection | null = null;
  private iceBuffer: RTCIceCandidateInit[] = [];
  private roomCode = '';
  private sessionId = '';
  private boardRole: BoardRole = 'host';
  private dataChannel: RTCDataChannel | null = null;
  private onChannel: ((ch: RTCDataChannel) => void) | null = null;
  private remoteEnded = false;
  private recovery: PeerRecoverySession | null = null;
  private readonly onRtcSignalMessage = (ev: MessageEvent) => {
    if (typeof ev.data !== 'string') return;
    const packet = parseRtcSignalWire(ev.data);
    if (!packet) return;
    void this.getRecovery().handleRemoteSignal(packet);
  };

  setOnDataChannel(cb: ((ch: RTCDataChannel) => void) | null): void {
    this.onChannel = cb;
    const ch = this.dataChannel;
    if (ch?.readyState === 'open' && cb) cb(ch);
  }

  hasActivePeer(): boolean {
    return !this.remoteEnded && this.pc !== null;
  }

  nudgeRecovery(): void {
    if (!this.hasActivePeer()) return;
    this.getRecovery().nudge();
  }

  getDataChannel(): RTCDataChannel | null {
    return this.dataChannel;
  }

  waitForDataChannel(timeoutMs = 30_000): Promise<RTCDataChannel> {
    const existing = this.dataChannel;
    if (existing?.readyState === 'open') return Promise.resolve(existing);

    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error('Data channel timeout'));
      }, timeoutMs);

      this.setOnDataChannel((ch) => {
        window.clearTimeout(timer);
        resolve(ch);
      });
    });
  }

  private resetPeer(): void {
    this.recovery?.dispose();
    this.recovery = null;
    if (this.dataChannel) {
      this.dataChannel.removeEventListener('message', this.onRtcSignalMessage);
    }
    this.dataChannel?.close();
    this.pc?.close();
    this.pc = null;
    this.dataChannel = null;
    this.iceBuffer = [];
  }

  private getRecovery(): PeerRecoverySession {
    if (!this.recovery) {
      this.recovery = new PeerRecoverySession({
        getPc: () => this.pc,
        isOfferer: () => this.boardRole === 'host',
        isEnded: () => this.remoteEnded,
        clearIceBuffer: () => {
          this.iceBuffer = [];
        },
        getIceBuffer: () => this.iceBuffer,
        onPhaseReconnecting: () => patchConnectionSession({ phase: 'reconnecting' }),
        onPhaseConnected: () => {
          this.remoteEnded = false;
          patchConnectionSession({ phase: 'connected' });
        },
        onPhaseConnecting: () => patchConnectionSession({ phase: 'connecting' }),
        onRecoveryFailed: () => this.handleRemoteEnd(),
        sendSignal: (packet) => this.sendRtcSignal(packet),
        waitIceGathering: (pc) => this.waitForIceGathering(pc),
      });
    }
    return this.recovery;
  }

  private sendRtcSignal(packet: SignalingPacket): void {
    const ch = this.dataChannel;
    if (ch?.readyState !== 'open') return;
    ch.send(serializeRtcSignalWire(packet));
  }

  private handleRemoteEnd(): void {
    if (this.remoteEnded) return;
    this.remoteEnded = true;
    this.resetPeer();
    patchConnectionSession({ phase: 'closed', error: 'remote_hangup' });
  }

  private ensurePc(): RTCPeerConnection {
    if (this.pc) return this.pc;

    const handlers: PeerHandlers = {
      onIceCandidate: (candidate) => {
        this.iceBuffer.push(candidate);
      },
      onConnectionStateChange: (state) => {
        this.getRecovery().handleConnectionState(state);
        if (state === 'closed' && !this.remoteEnded) {
          patchConnectionSession({ phase: 'closed' });
        }
      },
      onDataChannel: (channel) => {
        if (channel.label === WHITEBOARD_DATA_CHANNEL) {
          this.attachDataChannel(channel);
        }
      },
    };

    this.pc = createPeerConnection(handlers);
    return this.pc;
  }

  private attachDataChannel(channel: RTCDataChannel): void {
    this.dataChannel = channel;
    const pc = this.pc;
    const tryNotify = () => {
      if (channel.readyState !== 'open') return;
      if (!pc || pc.connectionState !== 'connected') return;
      patchConnectionSession({ phase: 'connected' });
      this.onChannel?.(channel);
    };
    channel.addEventListener('open', tryNotify);
    channel.addEventListener('message', this.onRtcSignalMessage);
    pc?.addEventListener('connectionstatechange', tryNotify);
    tryNotify();
  }

  isReady(): boolean {
    return (
      this.pc?.connectionState === 'connected' && this.dataChannel?.readyState === 'open'
    );
  }

  getConnectionState(): RTCPeerConnectionState | 'idle' {
    return this.pc?.connectionState ?? 'idle';
  }

  getLocalPacket(role: SignalingRole): SignalingPacket | null {
    const pc = this.pc;
    if (!pc?.localDescription) return null;
    return createSignalingPacket(role, pc.localDescription, [...this.iceBuffer], this.roomCode);
  }

  async startAsHost(): Promise<SignalingPacket> {
    this.remoteEnded = false;
    this.resetPeer();
    resetConnectionSession();
    this.boardRole = 'host';
    this.roomCode = generateRoomCode();
    this.sessionId = generateSessionId();
    patchConnectionSession({
      phase: 'creating',
      roomCode: this.roomCode,
      sessionId: this.sessionId,
      role: 'send',
    });

    const pc = this.ensurePc();
    const channel = createWhiteboardDataChannel(pc);
    this.attachDataChannel(channel);

    const offer = await createOffer(pc);
    await this.waitForIceGathering(pc);
    const packet = createSignalingPacket('offer', offer, [...this.iceBuffer], this.roomCode);
    patchConnectionSession({ phase: 'waitingAnswer', localPacket: packet });
    return packet;
  }

  async startAsGuest(hostInvite: SignalingPacket): Promise<SignalingPacket> {
    assertSignalingPacketRole(hostInvite, 'offer');
    this.remoteEnded = false;
    this.resetPeer();
    resetConnectionSession();
    this.boardRole = 'guest';
    this.roomCode = hostInvite.roomCode ?? generateRoomCode();
    this.sessionId = generateSessionId();
    patchConnectionSession({
      phase: 'connecting',
      roomCode: this.roomCode,
      sessionId: this.sessionId,
      role: 'receive',
    });

    const pc = this.ensurePc();
    await pc.setRemoteDescription(hostInvite.sdp);
    await addIceCandidates(pc, hostInvite.ice);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await this.waitForIceGathering(pc);
    const local = pc.localDescription;
    if (!local) throw new Error('Failed to create answer');
    return createSignalingPacket('answer', local, [...this.iceBuffer], this.roomCode);
  }

  async applyGuestResponse(guestResponse: SignalingPacket): Promise<void> {
    assertSignalingPacketRole(guestResponse, 'answer');
    const pc = this.ensurePc();
    await applyRemoteAnswer(pc, guestResponse.sdp, guestResponse.ice);
    patchConnectionSession({ phase: 'connecting' });
  }

  private waitForIceGathering(pc: RTCPeerConnection, maxMs = ICE_GATHER_TIMEOUT_MS): Promise<void> {
    if (pc.iceGatheringState === 'complete') return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => {
        pc.removeEventListener('icegatheringstatechange', onChange);
        resolve();
      };
      const onChange = () => {
        if (pc.iceGatheringState === 'complete') done();
      };
      pc.addEventListener('icegatheringstatechange', onChange);
      window.setTimeout(done, maxMs);
    });
  }

  refreshLocalPacket(role: SignalingRole): SignalingPacket | null {
    const packet = this.getLocalPacket(role);
    if (packet) patchConnectionSession({ localPacket: packet });
    return packet;
  }

  getSessionMeta() {
    return {
      sessionId: this.sessionId,
      roomCode: this.roomCode,
      role: this.boardRole === 'host' ? ('send' as const) : ('receive' as const),
      boardRole: this.boardRole,
    };
  }

  hangUp(): void {
    if (this.remoteEnded) return;
    this.remoteEnded = true;
    this.resetPeer();
    patchConnectionSession({ phase: 'closed' });
  }

  dispose(): void {
    this.remoteEnded = true;
    this.resetPeer();
  }
}

export const whiteboardConnectionManager = new WhiteboardConnectionManager();
