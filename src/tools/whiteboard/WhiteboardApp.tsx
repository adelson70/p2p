import { useCallback, useEffect, useRef, useState } from 'react';
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
import type { BoardRole } from '@/tools/whiteboard/whiteboardConnectionManager';
import { whiteboardConnectionManager } from '@/tools/whiteboard/whiteboardConnectionManager';
import { WhiteboardSession, type BoardStroke } from '@/tools/whiteboard/WhiteboardSession';
import { CanvasBoard } from '@/tools/whiteboard/CanvasBoard';
import { BOARD_COLORS, BOARD_WIDTHS, BoardHeader, BoardToolbar } from '@/tools/whiteboard/components';
import {
  ConnectionBadge,
  PairingStep,
  ShareSignalingBlock,
  SignalingCodeField,
} from '@/tools/privatedrop/components';
import { useImmersiveShell } from '@/hooks/useImmersiveShell';

type Step = 'role' | 'pairing' | 'board';

type PairingPhase = 'idle' | 'guest-has-response';

export function WhiteboardApp({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const session = useStore(connectionSession);
  const boardRoleRef = useRef<BoardRole>('host');

  const [step, setStep] = useState<Step>('role');
  const [boardRole, setBoardRole] = useState<BoardRole>('host');
  const [pairingPhase, setPairingPhase] = useState<PairingPhase>('idle');
  const [inviteQrUrl, setInviteQrUrl] = useState<string>();
  const [responseQrUrl, setResponseQrUrl] = useState<string>();
  const [showInviteQr, setShowInviteQr] = useState(false);
  const [showResponseQr, setShowResponseQr] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [responseCopied, setResponseCopied] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [strokes, setStrokes] = useState<BoardStroke[]>([]);
  const [color, setColor] = useState(BOARD_COLORS[0]);
  const [lineWidth, setLineWidth] = useState(BOARD_WIDTHS[1]);
  const boardSessionRef = useRef<WhiteboardSession | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const endedRef = useRef(false);

  const syncBoardRole = (role: BoardRole) => {
    boardRoleRef.current = role;
    setBoardRole(role);
  };

  const resetAfterBoard = useCallback(
    (remoteEnded: boolean) => {
      if (endedRef.current) return;
      endedRef.current = true;

      boardSessionRef.current?.dispose();
      boardSessionRef.current = null;
      whiteboardConnectionManager.dispose();
      setStep('role');
      setPairingPhase('idle');
      setStrokes([]);
      setInviteQrUrl(undefined);
      setResponseQrUrl(undefined);
      if (remoteEnded) {
        setPairingError(dict.whiteboard.peerLeft);
      } else {
        setPairingError(null);
      }
      endedRef.current = false;
    },
    [dict.whiteboard.peerLeft],
  );

  const startBoardSession = useCallback(
    (channel: RTCDataChannel) => {
      boardSessionRef.current?.dispose();
      const bs = new WhiteboardSession(channel, {
        onStrokesChange: setStrokes,
        onPeerLeave: () => resetAfterBoard(true),
      });
      boardSessionRef.current = bs;
      setStrokes(bs.getStrokes());
      setStep('board');
    },
    [resetAfterBoard],
  );

  useEffect(() => {
    whiteboardConnectionManager.setOnDataChannel((ch) => {
      startBoardSession(ch);
    });
    return () => {
      boardSessionRef.current?.dispose();
      boardSessionRef.current = null;
      whiteboardConnectionManager.dispose();
    };
  }, [startBoardSession]);

  useEffect(() => {
    if (step !== 'board') return;
    if (session.phase === 'closed') {
      resetAfterBoard(session.error === 'remote_hangup');
    }
  }, [session.phase, session.error, step, resetAfterBoard]);

  const loadQr = renderSignalingQrDataUrl;

  const beginHost = async () => {
    setPairingError(null);
    syncBoardRole('host');
    setPairingPhase('idle');
    setResponseQrUrl(undefined);
    setInviteQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    setStep('pairing');
    try {
      await whiteboardConnectionManager.startAsHost();
    } catch {
      setPairingError(dict.whiteboard.errorConnection);
    }
  };

  const beginGuest = () => {
    setPairingError(null);
    syncBoardRole('guest');
    setPairingPhase('idle');
    setInviteQrUrl(undefined);
    setResponseQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    whiteboardConnectionManager.dispose();
    setStep('pairing');
  };

  const submitInviteAsGuest = async (raw: string) => {
    setPairingError(null);
    try {
      const invite = parseSignalingInput(raw);
      await whiteboardConnectionManager.startAsGuest(invite);
      setResponseQrUrl(undefined);
      setShowResponseQr(false);
      setPairingPhase('guest-has-response');
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.whiteboard.errorConnection);
    }
  };

  const submitResponseAsHost = async (raw: string) => {
    setPairingError(null);
    try {
      const response = parseSignalingInput(raw);
      await whiteboardConnectionManager.applyGuestResponse(response);
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.whiteboard.errorConnection);
    }
  };

  const applySignalingPayload = async (raw: string) => {
    setPairingError(null);
    try {
      const packet = parseSignalingInput(raw);
      if (packet.role === 'offer') {
        if (boardRoleRef.current === 'host') {
          setPairingError(dict.whiteboard.wrongRoleOffer);
          return;
        }
        await submitInviteAsGuest(raw);
      } else {
        if (boardRoleRef.current === 'guest') {
          setPairingError(dict.whiteboard.wrongRoleAnswer);
          return;
        }
        await submitResponseAsHost(raw);
      }
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.whiteboard.errorConnection);
    }
  };

  const copyInvite = async () => {
    const packet = whiteboardConnectionManager.refreshLocalPacket('offer');
    if (!packet) return;
    await copySignalingToClipboard(packet);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const copyResponse = async () => {
    const packet = whiteboardConnectionManager.refreshLocalPacket('answer');
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
      getPacket: () => whiteboardConnectionManager.refreshLocalPacket('offer'),
      loadQr,
      onQrTooLarge: () => setPairingError(dict.privatedrop.qrTooLarge),
    });

  const toggleResponseQr = () =>
    runTogglePairingQr({
      visible: showResponseQr,
      setVisible: setShowResponseQr,
      setDataUrl: setResponseQrUrl,
      getPacket: () => whiteboardConnectionManager.refreshLocalPacket('answer'),
      loadQr,
      onQrTooLarge: () => setPairingError(dict.privatedrop.qrTooLarge),
    });

  const connectionLabel = (() => {
    if (whiteboardConnectionManager.isReady()) return dict.whiteboard.statusConnected;
    const state = whiteboardConnectionManager.getConnectionState();
    if (state === 'failed') return dict.whiteboard.statusFailed;
    if (state === 'connecting' || state === 'new') return dict.whiteboard.statusConnecting;
    return dict.whiteboard.statusSignaling;
  })();

  const leaveBoard = () => {
    boardSessionRef.current?.leave();
    whiteboardConnectionManager.hangUp();
    resetAfterBoard(false);
  };

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `whiteboard-${session.roomCode ?? 'export'}.png`;
    link.click();
  };

  const ready = whiteboardConnectionManager.isReady();
  const isHost = boardRole === 'host';

  useImmersiveShell(step === 'board');

  if (step === 'board') {
    const bs = boardSessionRef.current;
    return (
      <div className="fill-main-immersive flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <BoardHeader
          locale={locale}
          roomCode={session.roomCode}
          statusText={connectionLabel}
          connected={ready}
          onLeave={leaveBoard}
        />
        {pairingError ? (
          <p className="shrink-0 bg-red-950/40 px-4 py-2 text-center text-sm text-red-300">{pairingError}</p>
        ) : null}
        <CanvasBoard
          strokes={strokes}
          disabled={!ready}
          exportRef={canvasRef}
          onBeginStroke={(id, pt) => bs?.beginStroke(id, color, lineWidth, pt)}
          onAppendPoints={(id, pts) => bs?.appendPoints(id, pts)}
          onEndStroke={(id) => bs?.endStroke(id)}
        />
        <BoardToolbar
          locale={locale}
          color={color}
          lineWidth={lineWidth}
          disabled={!ready}
          onColor={setColor}
          onWidth={setLineWidth}
          onClear={() => bs?.clearBoard()}
          onUndo={() => bs?.undoLastLocal()}
          onExport={exportPng}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full min-h-0 flex-1 flex-col items-center px-4 py-6 sm:max-w-lg md:max-w-md md:py-10">
      <PageHeader
        className="text-center"
        title={dict.whiteboard.title}
        subtitle={dict.whiteboard.subtitle}
      />

      {step === 'pairing' && (
        <div className="mb-6 flex justify-center">
          <ConnectionBadge
            label={dict.whiteboard.connectionStatus}
            statusText={connectionLabel}
            connected={whiteboardConnectionManager.isReady()}
          />
        </div>
      )}

      {pairingError ? (
        <p className="mb-4 w-full text-center text-sm text-red-400">{pairingError}</p>
      ) : null}

      {step === 'role' && (
        <Card className="w-full space-y-4 text-center">
          <p className="font-medium">{dict.whiteboard.roleTitle}</p>
          <p className="text-sm text-muted">{dict.whiteboard.roleHint}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => void beginHost()}>{dict.whiteboard.createRoom}</Button>
            <Button variant="secondary" onClick={beginGuest}>
              {dict.whiteboard.joinRoom}
            </Button>
          </div>
        </Card>
      )}

      {step === 'pairing' && (
        <Card className="w-full space-y-6">
          <p className="text-center font-medium">
            {isHost ? dict.whiteboard.pairingHostTitle : dict.whiteboard.pairingGuestTitle}
          </p>

          {isHost ? (
            <>
              <PairingStep step={1} title={dict.whiteboard.stepShare}>
                <ShareSignalingBlock
                  locale={locale}
                  roomCode={session.roomCode}
                  copyLabel={dict.whiteboard.copyInvite}
                  qrDataUrl={inviteQrUrl}
                  qrVisible={showInviteQr}
                  onToggleQr={() => void toggleInviteQr()}
                  onCopy={() => void copyInvite()}
                  copied={inviteCopied}
                />
              </PairingStep>
              <PairingStep step={2} title={dict.whiteboard.stepReceive}>
                <SignalingCodeField locale={locale} onApply={(raw) => void applySignalingPayload(raw)} />
              </PairingStep>
            </>
          ) : (
            <>
              <PairingStep step={1} title={dict.whiteboard.stepReceive}>
                <SignalingCodeField locale={locale} onApply={(raw) => void applySignalingPayload(raw)} />
              </PairingStep>
              {pairingPhase === 'guest-has-response' ? (
                <PairingStep step={2} title={dict.whiteboard.stepShare}>
                  <ShareSignalingBlock
                    locale={locale}
                    roomCode={session.roomCode}
                    copyLabel={dict.whiteboard.copyResponse}
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
            <summary className="cursor-pointer select-none">{dict.whiteboard.howItWorks}</summary>
            <p className="mt-2">{dict.whiteboard.iceHint}</p>
          </details>
        </Card>
      )}
    </div>
  );
}
