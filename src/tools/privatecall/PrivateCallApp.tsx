import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { connectionSession } from '@/features/connection/connectionSession';
import { copySignalingToClipboard } from '@/features/connection/signalingManual';
import {
  parseSignalingInput,
  renderSignalingQrDataUrl,
} from '@/features/connection/pairingQr';
import { runTogglePairingQr } from '@/features/connection/openPairingQr';
import { putSession, updateSession } from '@/services/db';
import type { CallRole } from '@/tools/privatecall/callConnectionManager';
import { callConnectionManager } from '@/tools/privatecall/callConnectionManager';
import {
  ConnectionBadge,
  PairingStep,
  ShareSignalingBlock,
  SignalingCodeField,
} from '@/tools/privatedrop/components';
import { useImmersiveShell } from '@/hooks/useImmersiveShell';

type Step = 'role' | 'pairing' | 'call';

type PairingPhase = 'idle' | 'callee-has-response';

function VideoPane({
  stream,
  label,
  mirror,
  className = '',
}: {
  stream: MediaStream | null;
  label: string;
  mirror?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.srcObject = stream;
    void el.play().catch(() => {});
    return () => {
      el.srcObject = null;
    };
  }, [stream]);

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-xl border border-border bg-black ${className}`}
    >
      <video
        ref={ref}
        className={`h-full w-full object-cover ${mirror ? 'scale-x-[-1]' : ''}`}
        playsInline
        autoPlay
        muted={mirror}
      />
      {!stream ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">{label}</div>
      ) : (
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

export function PrivateCallApp({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const session = useStore(connectionSession);
  const callRoleRef = useRef<CallRole>('caller');

  const [step, setStep] = useState<Step>('role');
  const [callRole, setCallRole] = useState<CallRole>('caller');
  const [videoCall, setVideoCall] = useState(true);
  const [pairingPhase, setPairingPhase] = useState<PairingPhase>('idle');
  const [inviteQrUrl, setInviteQrUrl] = useState<string>();
  const [responseQrUrl, setResponseQrUrl] = useState<string>();
  const [showInviteQr, setShowInviteQr] = useState(false);
  const [showResponseQr, setShowResponseQr] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [responseCopied, setResponseCopied] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const sessionLoggedRef = useRef(false);
  const endedCallRef = useRef(false);

  const resetAfterCall = async (remoteEnded: boolean) => {
    if (endedCallRef.current) return;
    endedCallRef.current = true;

    const meta = callConnectionManager.getSessionMeta();
    if (sessionLoggedRef.current && meta.sessionId) {
      await updateSession(meta.sessionId, { status: 'completed', endedAt: Date.now() });
    }
    sessionLoggedRef.current = false;
    callConnectionManager.dispose();
    setStep('role');
    setPairingPhase('idle');
    setLocalStream(null);
    setRemoteStream(null);
    setInviteQrUrl(undefined);
    setResponseQrUrl(undefined);
    setMicOn(true);
    setCamOn(true);
    if (remoteEnded) {
      setPairingError(dict.privatecall.remoteHangUp);
    } else {
      setPairingError(null);
    }
    endedCallRef.current = false;
  };

  const syncCallRole = (role: CallRole) => {
    callRoleRef.current = role;
    setCallRole(role);
  };

  useEffect(() => {
    callConnectionManager.setOnRemoteStream(setRemoteStream);
    return () => {
      callConnectionManager.dispose();
      setLocalStream(null);
      setRemoteStream(null);
      sessionLoggedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (step !== 'call') return;
    if (session.phase === 'closed') {
      void resetAfterCall(session.error === 'remote_hangup');
    } else if (session.phase === 'failed') {
      void resetAfterCall(false);
      setPairingError(dict.privatecall.errorConnection);
    }
  }, [session.phase, session.error, step]);

  useEffect(() => {
    if (session.phase !== 'connected' || step === 'call') return;
    const enterCall = async () => {
      setLocalStream(callConnectionManager.getLocalStream());
      if (!sessionLoggedRef.current) {
        sessionLoggedRef.current = true;
        const meta = callConnectionManager.getSessionMeta();
        await putSession({
          id: meta.sessionId,
          toolId: 'privatecall',
          roomCode: meta.roomCode,
          role: meta.role,
          startedAt: Date.now(),
          status: 'active',
        });
      }
      setStep('call');
    };
    void enterCall();
  }, [session.phase, step]);

  const loadQr = renderSignalingQrDataUrl;

  const beginCaller = async () => {
    setPairingError(null);
    syncCallRole('caller');
    setPairingPhase('idle');
    setResponseQrUrl(undefined);
    setInviteQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    setStep('pairing');
    try {
      await callConnectionManager.startAsCaller(videoCall);
      setLocalStream(callConnectionManager.getLocalStream());
    } catch {
      setPairingError(dict.privatecall.errorConnection);
    }
  };

  const beginCallee = () => {
    setPairingError(null);
    syncCallRole('callee');
    setPairingPhase('idle');
    setInviteQrUrl(undefined);
    setResponseQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    callConnectionManager.dispose();
    setLocalStream(null);
    setRemoteStream(null);
    setStep('pairing');
  };

  const submitInviteAsCallee = async (raw: string) => {
    setPairingError(null);
    try {
      const invite = parseSignalingInput(raw);
      await callConnectionManager.startAsCallee(invite, videoCall);
      setLocalStream(callConnectionManager.getLocalStream());
      setResponseQrUrl(undefined);
      setShowResponseQr(false);
      setPairingPhase('callee-has-response');
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatecall.errorConnection);
    }
  };

  const submitResponseAsCaller = async (raw: string) => {
    setPairingError(null);
    try {
      const response = parseSignalingInput(raw);
      await callConnectionManager.applyCalleeResponse(response);
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatecall.errorConnection);
    }
  };

  const applySignalingPayload = async (raw: string) => {
    setPairingError(null);
    try {
      const packet = parseSignalingInput(raw);
      if (packet.role === 'offer') {
        if (callRoleRef.current === 'caller') {
          setPairingError(dict.privatecall.wrongRoleOffer);
          return;
        }
        await submitInviteAsCallee(raw);
      } else {
        if (callRoleRef.current === 'callee') {
          setPairingError(dict.privatecall.wrongRoleAnswer);
          return;
        }
        await submitResponseAsCaller(raw);
      }
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatecall.errorConnection);
    }
  };

  const copyInvite = async () => {
    const packet = callConnectionManager.refreshLocalPacket('offer');
    if (!packet) return;
    await copySignalingToClipboard(packet);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const copyResponse = async () => {
    const packet = callConnectionManager.refreshLocalPacket('answer');
    if (!packet) return;
    await copySignalingToClipboard(packet);
    setResponseCopied(true);
    setTimeout(() => setResponseCopied(false), 2000);
  };

  const toggleInviteQr = () =>
    runTogglePairingQr({
      visible: showInviteQr,
      setVisible: setShowInviteQr,
      setDataUrl: setInviteQrUrl,
      getPacket: () => callConnectionManager.refreshLocalPacket('offer'),
      loadQr,
      onQrTooLarge: () => setPairingError(dict.privatedrop.qrTooLarge),
    });

  const toggleResponseQr = () =>
    runTogglePairingQr({
      visible: showResponseQr,
      setVisible: setShowResponseQr,
      setDataUrl: setResponseQrUrl,
      getPacket: () => callConnectionManager.refreshLocalPacket('answer'),
      loadQr,
      onQrTooLarge: () => setPairingError(dict.privatedrop.qrTooLarge),
    });

  const connectionLabel = (() => {
    if (callConnectionManager.isInCall()) return dict.privatecall.statusConnected;
    const state = callConnectionManager.getConnectionState();
    if (state === 'failed') return dict.privatecall.statusFailed;
    if (state === 'connecting' || state === 'new') return dict.privatecall.statusConnecting;
    return dict.privatecall.statusSignaling;
  })();

  const hangUp = () => {
    callConnectionManager.hangUp();
  };

  const toggleMic = () => {
    const next = !micOn;
    setMicOn(next);
    callConnectionManager.setMicrophoneEnabled(next);
  };

  const toggleCam = () => {
    if (!callConnectionManager.hasVideoTrack()) return;
    const next = !camOn;
    setCamOn(next);
    callConnectionManager.setCameraEnabled(next);
  };

  const isCaller = callRole === 'caller';

  useImmersiveShell(step === 'call');

  if (step === 'call') {
    const showLocalVideo = videoCall && callConnectionManager.hasVideoTrack();
    return (
      <div className="fill-main-immersive flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-black">
        <div className="relative min-h-0 flex-1">
          <VideoPane
            stream={remoteStream}
            label={dict.privatecall.remoteVideo}
            className="absolute inset-0 aspect-auto h-full w-full rounded-none border-0"
          />
          {showLocalVideo ? (
            <div className="absolute bottom-4 right-3 z-10 w-28 overflow-hidden rounded-lg border border-white/20 shadow-lg sm:bottom-6 sm:w-36">
              <VideoPane
                stream={localStream}
                label={dict.privatecall.localVideo}
                mirror
                className="aspect-video rounded-none border-0"
              />
            </div>
          ) : (
            <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/80">
              {dict.privatecall.audioOnly}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap justify-center gap-2 border-t border-white/10 bg-[#202c33] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button size="sm" variant="secondary" onClick={toggleMic}>
            {micOn ? dict.privatecall.mute : dict.privatecall.unmute}
          </Button>
          {callConnectionManager.hasVideoTrack() ? (
            <Button size="sm" variant="secondary" onClick={toggleCam}>
              {camOn ? dict.privatecall.cameraOff : dict.privatecall.cameraOn}
            </Button>
          ) : null}
          <Button size="sm" variant="danger" onClick={hangUp}>
            {dict.privatecall.hangUp}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full min-h-0 flex-1 flex-col items-center px-4 py-6 sm:max-w-lg md:max-w-md">
      <PageHeader
        className="text-center"
        title={dict.privatecall.title}
        subtitle={dict.privatecall.subtitle}
      />

      {(step === 'pairing') && (
        <div className="mb-6 flex justify-center">
          <ConnectionBadge
            label={dict.privatecall.connectionStatus}
            statusText={connectionLabel}
            connected={callConnectionManager.isInCall()}
          />
        </div>
      )}

      {pairingError && step !== 'role' ? (
        <p className="mb-4 w-full text-center text-sm text-red-400">{pairingError}</p>
      ) : null}

      {step === 'role' && (
        <Card className="w-full space-y-4 text-center">
          <p className="font-medium">{dict.privatecall.roleTitle}</p>
          <p className="text-sm text-muted">{dict.privatecall.roleHint}</p>
          <label className="flex items-center justify-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={videoCall}
              onChange={(e) => setVideoCall(e.target.checked)}
              className="rounded border-border"
            />
            {dict.privatecall.videoCall}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => void beginCaller()}>{dict.privatecall.startCall}</Button>
            <Button variant="secondary" onClick={beginCallee}>
              {dict.privatecall.joinCall}
            </Button>
          </div>
        </Card>
      )}

      {step === 'pairing' && (
        <Card className="w-full space-y-6">
          <p className="text-center font-medium">
            {isCaller ? dict.privatecall.pairingCallerTitle : dict.privatecall.pairingCalleeTitle}
          </p>

          {isCaller ? (
            <>
              <PairingStep step={1} title={dict.privatecall.stepShare}>
                <ShareSignalingBlock
                  locale={locale}
                  roomCode={session.roomCode}
                  copyLabel={dict.privatecall.copyInvite}
                  qrDataUrl={inviteQrUrl}
                  qrVisible={showInviteQr}
                  onToggleQr={() => void toggleInviteQr()}
                  onCopy={() => void copyInvite()}
                  copied={inviteCopied}
                />
              </PairingStep>
              <PairingStep step={2} title={dict.privatecall.stepReceive}>
                <SignalingCodeField locale={locale} onApply={(raw) => void applySignalingPayload(raw)} />
              </PairingStep>
            </>
          ) : (
            <>
              <PairingStep step={1} title={dict.privatecall.stepReceive}>
                <SignalingCodeField locale={locale} onApply={(raw) => void applySignalingPayload(raw)} />
              </PairingStep>
              {pairingPhase === 'callee-has-response' ? (
                <PairingStep step={2} title={dict.privatecall.stepShare}>
                  <ShareSignalingBlock
                    locale={locale}
                    roomCode={session.roomCode}
                    copyLabel={dict.privatecall.copyResponse}
                    qrDataUrl={responseQrUrl}
                    qrVisible={showResponseQr}
                    onToggleQr={() => void toggleResponseQr()}
                    onCopy={() => void copyResponse()}
                    copied={responseCopied}
                  />
                </PairingStep>
              ) : null}
            </>
          )}

          <details className="text-xs text-muted">
            <summary className="cursor-pointer select-none">{dict.privatecall.howItWorks}</summary>
            <p className="mt-2">{dict.privatecall.iceHint}</p>
          </details>
        </Card>
      )}

    </div>
  );
}
