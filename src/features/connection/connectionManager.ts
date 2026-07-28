import {
  acceptAnswer,
  addIceCandidates,
  createOffer,
  createOutboundDataChannel,
  createPeerConnection,
  type PeerHandlers,
} from './webrtc';
import {
  createSignalingPacket,
  type SignalingPacket,
  type SignalingRole,
} from './signalingManual';
import { generateRoomCode, generateSessionId } from './roomCode';
import { patchConnectionSession, resetConnectionSession } from './connectionSession';
import { PeerRecoverySession } from './peerRecovery';
import { parseRtcSignalWire, serializeRtcSignalWire } from './rtcSignalWire';
import type { FileRole } from '@/tools/privatedrop/roles';
import { assertSignalingPacketRole } from '@/tools/privatedrop/roles';
import { ICE_GATHER_TIMEOUT_MS } from '@/features/connection/rtcConfig';

export class ConnectionManager {
  private pc: RTCPeerConnection | null = null;
  private iceBuffer: RTCIceCandidateInit[] = [];
  private roomCode = '';
  private sessionId = '';
  private fileRole: FileRole = 'file-sender';
  private dataChannel: RTCDataChannel | null = null;
  private onChannel: ((ch: RTCDataChannel) => void) | null = null;
  private recovery: PeerRecoverySession | null = null;
  private readonly onRtcSignalMessage = (ev: MessageEvent) => {
    if (typeof ev.data !== 'string') return;
    const packet = parseRtcSignalWire(ev.data);
    if (!packet) return;
    void this.getRecovery().handleRemoteSignal(packet);
  };

  setOnDataChannel(cb: (ch: RTCDataChannel) => void): void {
    this.onChannel = cb;
    const ch = this.dataChannel;
    if (ch?.readyState === 'open') cb(ch);
  }

  getDataChannel(): RTCDataChannel | null {
    if (this.dataChannel?.readyState === 'open') return this.dataChannel;
    return null;
  }

  waitForDataChannel(timeoutMs = 30_000): Promise<RTCDataChannel> {
    const existing = this.getDataChannel();
    if (existing) return Promise.resolve(existing);

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
        isOfferer: () => this.fileRole === 'file-sender',
        isEnded: () => !this.pc,
        clearIceBuffer: () => {
          this.iceBuffer = [];
        },
        getIceBuffer: () => this.iceBuffer,
        onPhaseReconnecting: () => patchConnectionSession({ phase: 'reconnecting' }),
        onPhaseConnected: () => patchConnectionSession({ phase: 'connected' }),
        onPhaseConnecting: () => patchConnectionSession({ phase: 'connecting' }),
        onRecoveryFailed: () => {
          patchConnectionSession({ phase: 'failed', error: 'Connection failed' });
          this.resetPeer();
        },
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

  private ensurePc(): RTCPeerConnection {
    if (this.pc) return this.pc;

    const handlers: PeerHandlers = {
      onIceCandidate: (candidate) => {
        this.iceBuffer.push(candidate);
      },
      onConnectionStateChange: (state) => {
        this.getRecovery().handleConnectionState(state);
        if (state === 'closed') {
          patchConnectionSession({ phase: 'closed' });
        }
      },
      onDataChannel: (channel) => {
        this.attachDataChannel(channel);
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

  /** True when WebRTC peer link is up and the data channel can carry file bytes. */
  isReadyForTransfer(): boolean {
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

  /** File sender (host): creates room invite (WebRTC offer + data channel). */
  async startAsFileSender(): Promise<SignalingPacket> {
    this.resetPeer();
    resetConnectionSession();
    this.fileRole = 'file-sender';
    this.roomCode = generateRoomCode();
    this.sessionId = generateSessionId();
    patchConnectionSession({
      phase: 'creating',
      roomCode: this.roomCode,
      sessionId: this.sessionId,
      role: 'send',
    });

    const pc = this.ensurePc();
    const channel = createOutboundDataChannel(pc);
    this.attachDataChannel(channel);

    const offer = await createOffer(pc);
    await this.waitForIceGathering(pc);
    const packet = createSignalingPacket('offer', offer, [...this.iceBuffer], this.roomCode);
    patchConnectionSession({ phase: 'waitingAnswer', localPacket: packet });
    return packet;
  }

  /** File receiver (guest): consumes host invite, returns response for host. */
  async startAsFileReceiver(hostInvite: SignalingPacket): Promise<SignalingPacket> {
    assertSignalingPacketRole(hostInvite, 'offer');
    this.resetPeer();
    resetConnectionSession();
    this.fileRole = 'file-receiver';
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

  /** File sender: applies guest response after invite was shared. */
  async applyGuestResponse(guestResponse: SignalingPacket): Promise<void> {
    assertSignalingPacketRole(guestResponse, 'answer');
    const pc = this.ensurePc();
    await acceptAnswer(pc, guestResponse.sdp);
    await addIceCandidates(pc, guestResponse.ice);
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
      role: this.fileRole === 'file-sender' ? ('send' as const) : ('receive' as const),
      fileRole: this.fileRole,
    };
  }

  close(): void {
    this.resetPeer();
    patchConnectionSession({ phase: 'closed' });
  }
}

export const connectionManager = new ConnectionManager();
