import {
  addIceCandidates,
  applyRemoteAnswer,
  createCallControlChannel,
  createOffer,
  createPeerConnection,
  CALL_CONTROL_CHANNEL,
  type PeerHandlers,
} from '@/features/connection/webrtc';
import {
  createSignalingPacket,
  type SignalingPacket,
  type SignalingRole,
} from '@/features/connection/signalingManual';
import { generateRoomCode, generateSessionId } from '@/features/connection/roomCode';
import { patchConnectionSession, resetConnectionSession, connectionSession } from '@/features/connection/connectionSession';
import { PeerRecoverySession } from '@/features/connection/peerRecovery';
import { parseRtcSignalWire, serializeRtcSignalWire } from '@/features/connection/rtcSignalWire';
import { assertSignalingPacketRole } from '@/tools/privatedrop/roles';
import { ICE_GATHER_TIMEOUT_MS } from '@/features/connection/rtcConfig';

export type CallRole = 'caller' | 'callee';

type ControlMessage = { type: 'hangup' };

export class CallConnectionManager {
  private pc: RTCPeerConnection | null = null;
  private iceBuffer: RTCIceCandidateInit[] = [];
  private roomCode = '';
  private sessionId = '';
  private callRole: CallRole = 'caller';
  private localStream: MediaStream | null = null;
  private controlChannel: RTCDataChannel | null = null;
  private remoteEnded = false;
  private onRemoteStream: ((stream: MediaStream) => void) | null = null;
  private recovery: PeerRecoverySession | null = null;
  private readonly onControlChannelMessage = (ev: MessageEvent) => {
    if (typeof ev.data !== 'string') return;
    const rtc = parseRtcSignalWire(ev.data);
    if (rtc) {
      void this.getRecovery().handleRemoteSignal(rtc);
      return;
    }
    try {
      const msg = JSON.parse(ev.data) as ControlMessage;
      if (msg.type === 'hangup') this.handleRemoteHangUp();
    } catch {
      // ignore
    }
  };

  setOnRemoteStream(cb: ((stream: MediaStream) => void) | null): void {
    this.onRemoteStream = cb;
  }

  hasActivePeer(): boolean {
    return !this.remoteEnded && this.pc !== null;
  }

  nudgeRecovery(): void {
    if (!this.hasActivePeer()) return;
    this.getRecovery().nudge();
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  private resetPeer(): void {
    this.recovery?.dispose();
    this.recovery = null;
    if (this.controlChannel) {
      this.controlChannel.removeEventListener('message', this.onControlChannelMessage);
    }
    this.controlChannel = null;
    this.pc?.close();
    this.pc = null;
    this.iceBuffer = [];
  }

  private getRecovery(): PeerRecoverySession {
    if (!this.recovery) {
      this.recovery = new PeerRecoverySession({
        getPc: () => this.pc,
        isOfferer: () => this.callRole === 'caller',
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
        onRecoveryFailed: () => this.handleRemoteHangUp(),
        sendSignal: (packet) => this.sendRtcSignal(packet),
        waitIceGathering: (pc) => this.waitForIceGathering(pc),
      });
    }
    return this.recovery;
  }

  private sendRtcSignal(packet: SignalingPacket): void {
    const ch = this.controlChannel;
    if (ch?.readyState !== 'open') return;
    ch.send(serializeRtcSignalWire(packet));
  }

  private stopLocalMedia(): void {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
  }

  private sendControl(msg: ControlMessage): void {
    const ch = this.controlChannel;
    if (ch?.readyState === 'open') {
      ch.send(JSON.stringify(msg));
    }
  }

  private attachControlChannel(channel: RTCDataChannel): void {
    this.controlChannel = channel;
    channel.addEventListener('message', this.onControlChannelMessage);
  }

  private handleRemoteHangUp(): void {
    if (this.remoteEnded) return;
    this.remoteEnded = true;
    this.stopLocalMedia();
    this.resetPeer();
    patchConnectionSession({ phase: 'closed', error: 'remote_hangup' });
  }

  private bindRemoteTrackEnd(stream: MediaStream): void {
    for (const track of stream.getTracks()) {
      track.addEventListener('ended', () => {
        const phase = connectionSession.get().phase;
        if (phase === 'reconnecting') return;
        if (this.pc?.connectionState === 'connected') {
          this.handleRemoteHangUp();
        }
      });
    }
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
        if (channel.label === CALL_CONTROL_CHANNEL) {
          this.attachControlChannel(channel);
        }
      },
    };

    this.pc = createPeerConnection(handlers);
    this.pc.ontrack = (ev) => {
      const stream = ev.streams[0] ?? new MediaStream([ev.track]);
      this.bindRemoteTrackEnd(stream);
      this.onRemoteStream?.(stream);
    };
    return this.pc;
  }

  private attachLocalTracks(pc: RTCPeerConnection): void {
    if (!this.localStream) throw new Error('Local media not started');
    for (const track of this.localStream.getTracks()) {
      pc.addTrack(track, this.localStream);
    }
  }

  async acquireLocalMedia(video: boolean): Promise<MediaStream> {
    this.stopLocalMedia();
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: video ? { facingMode: 'user' } : false,
    });
    return this.localStream;
  }

  setMicrophoneEnabled(enabled: boolean): void {
    this.localStream?.getAudioTracks().forEach((t) => {
      t.enabled = enabled;
    });
  }

  setCameraEnabled(enabled: boolean): void {
    this.localStream?.getVideoTracks().forEach((t) => {
      t.enabled = enabled;
    });
  }

  hasVideoTrack(): boolean {
    return (this.localStream?.getVideoTracks().length ?? 0) > 0;
  }

  isInCall(): boolean {
    return this.pc?.connectionState === 'connected';
  }

  getConnectionState(): RTCPeerConnectionState | 'idle' {
    return this.pc?.connectionState ?? 'idle';
  }

  getLocalPacket(role: SignalingRole): SignalingPacket | null {
    const pc = this.pc;
    if (!pc?.localDescription) return null;
    return createSignalingPacket(role, pc.localDescription, [...this.iceBuffer], this.roomCode);
  }

  async startAsCaller(video: boolean): Promise<SignalingPacket> {
    this.remoteEnded = false;
    this.resetPeer();
    resetConnectionSession();
    this.callRole = 'caller';
    this.roomCode = generateRoomCode();
    this.sessionId = generateSessionId();
    patchConnectionSession({
      phase: 'creating',
      roomCode: this.roomCode,
      sessionId: this.sessionId,
      role: 'send',
    });

    await this.acquireLocalMedia(video);
    const pc = this.ensurePc();
    this.attachControlChannel(createCallControlChannel(pc));
    this.attachLocalTracks(pc);

    const offer = await createOffer(pc);
    await this.waitForIceGathering(pc);
    const packet = createSignalingPacket('offer', offer, [...this.iceBuffer], this.roomCode);
    patchConnectionSession({ phase: 'waitingAnswer', localPacket: packet });
    return packet;
  }

  async startAsCallee(hostInvite: SignalingPacket, video: boolean): Promise<SignalingPacket> {
    assertSignalingPacketRole(hostInvite, 'offer');
    this.remoteEnded = false;
    this.resetPeer();
    resetConnectionSession();
    this.callRole = 'callee';
    this.roomCode = hostInvite.roomCode ?? generateRoomCode();
    this.sessionId = generateSessionId();
    patchConnectionSession({
      phase: 'connecting',
      roomCode: this.roomCode,
      sessionId: this.sessionId,
      role: 'receive',
    });

    await this.acquireLocalMedia(video);
    const pc = this.ensurePc();
    await pc.setRemoteDescription(hostInvite.sdp);
    await addIceCandidates(pc, hostInvite.ice);
    this.attachLocalTracks(pc);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await this.waitForIceGathering(pc);
    const local = pc.localDescription;
    if (!local) throw new Error('Failed to create answer');
    return createSignalingPacket('answer', local, [...this.iceBuffer], this.roomCode);
  }

  async applyCalleeResponse(guestResponse: SignalingPacket): Promise<void> {
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
      role: this.callRole === 'caller' ? ('send' as const) : ('receive' as const),
      callRole: this.callRole,
    };
  }

  /** Local user ended the call — notify peer then tear down. */
  hangUp(): void {
    if (this.remoteEnded) return;
    this.remoteEnded = true;
    this.sendControl({ type: 'hangup' });
    this.pc?.getSenders().forEach((s) => s.track?.stop());
    this.stopLocalMedia();
    this.resetPeer();
    patchConnectionSession({ phase: 'closed' });
  }

  /** Unmount / reset without signaling peer. */
  dispose(): void {
    this.remoteEnded = true;
    this.stopLocalMedia();
    this.resetPeer();
  }

  close(): void {
    this.hangUp();
  }
}

export const callConnectionManager = new CallConnectionManager();
