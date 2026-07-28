import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Progress } from '@/components/Progress';
import { connectionSession } from '@/features/connection/connectionSession';
import { connectionManager } from '@/features/connection/connectionManager';
import { copySignalingToClipboard } from '@/features/connection/signalingManual';
import {
  parseSignalingInput,
  renderSignalingQrDataUrl,
} from '@/features/connection/pairingQr';
import { runTogglePairingQr } from '@/features/connection/openPairingQr';
import { putSession, updateSession } from '@/services/db';
import type { FileRole } from '@/tools/privatedrop/roles';
import {
  ConnectionBadge,
  DropZone,
  FileQueue,
  PairingStep,
  ShareSignalingBlock,
  SignalingCodeField,
} from './components';
import { FileReceiver, FileSender, saveReceivedFile, type FileTransferProgress } from './transfer';

type Step = 'role' | 'pairing' | 'transfer' | 'complete';

type PairingPhase = 'idle' | 'guest-has-response';

export function PrivateDropApp({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const session = useStore(connectionSession);
  const fileRoleRef = useRef<FileRole>('file-sender');
  const receiverRef = useRef<FileReceiver | null>(null);

  const [step, setStep] = useState<Step>('role');
  const [fileRole, setFileRole] = useState<FileRole>('file-sender');
  const [pairingPhase, setPairingPhase] = useState<PairingPhase>('idle');
  const [inviteQrUrl, setInviteQrUrl] = useState<string>();
  const [responseQrUrl, setResponseQrUrl] = useState<string>();
  const [showInviteQr, setShowInviteQr] = useState(false);
  const [showResponseQr, setShowResponseQr] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [responseCopied, setResponseCopied] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<FileTransferProgress | null>(null);
  const fileSenderRef = useRef<FileSender | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);

  const syncFileRole = (role: FileRole) => {
    fileRoleRef.current = role;
    setFileRole(role);
  };

  const onDataChannelReady = useCallback(async (channel: RTCDataChannel) => {
    const meta = connectionManager.getSessionMeta();
    await putSession({
      id: meta.sessionId,
      toolId: 'privatedrop',
      roomCode: meta.roomCode,
      role: meta.role,
      startedAt: Date.now(),
      status: 'active',
    });

    if (fileRoleRef.current === 'file-receiver') {
      receiverRef.current = new FileReceiver(channel, {
        onFileComplete: async (file) => {
          await saveReceivedFile(file);
          setStep('complete');
          await updateSession(meta.sessionId, { status: 'completed', endedAt: Date.now() });
        },
        onProgress: setProgress,
      });
    }

    setStep('transfer');
  }, []);

  useEffect(() => {
    connectionManager.setOnDataChannel((ch) => {
      void onDataChannelReady(ch);
    });
    return () => {
      fileSenderRef.current?.dispose();
      fileSenderRef.current = null;
      receiverRef.current = null;
      connectionManager.close();
    };
  }, [onDataChannelReady]);

  const loadQr = renderSignalingQrDataUrl;

  const beginFileSender = async () => {
    setPairingError(null);
    syncFileRole('file-sender');
    setPairingPhase('idle');
    setResponseQrUrl(undefined);
    setInviteQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    setStep('pairing');
    try {
      await connectionManager.startAsFileSender();
    } catch {
      setPairingError(dict.privatedrop.errorConnection);
    }
  };

  const beginFileReceiver = () => {
    setPairingError(null);
    syncFileRole('file-receiver');
    setPairingPhase('idle');
    setInviteQrUrl(undefined);
    setResponseQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    connectionManager.close();
    setStep('pairing');
  };

  const submitHostInviteAsGuest = async (raw: string) => {
    setPairingError(null);
    try {
      const invite = parseSignalingInput(raw);
      await connectionManager.startAsFileReceiver(invite);
      setResponseQrUrl(undefined);
      setShowResponseQr(false);
      setPairingPhase('guest-has-response');
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatedrop.errorConnection);
    }
  };

  const submitGuestResponseAsHost = async (raw: string) => {
    setPairingError(null);
    try {
      const response = parseSignalingInput(raw);
      await connectionManager.applyGuestResponse(response);
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatedrop.errorConnection);
    }
  };

  const applySignalingPayload = async (raw: string) => {
    setPairingError(null);
    try {
      const packet = parseSignalingInput(raw);
      if (packet.role === 'offer') {
        if (fileRoleRef.current === 'file-sender') {
          setPairingError(dict.privatedrop.wrongRoleOffer);
          return;
        }
        await submitHostInviteAsGuest(raw);
      } else {
        if (fileRoleRef.current === 'file-receiver') {
          setPairingError(dict.privatedrop.wrongRoleAnswer);
          return;
        }
        await submitGuestResponseAsHost(raw);
      }
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatedrop.errorConnection);
    }
  };

  const copyHostInvite = async () => {
    const packet = connectionManager.refreshLocalPacket('offer');
    if (!packet) return;
    await copySignalingToClipboard(packet);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const copyGuestResponse = async () => {
    const packet = connectionManager.refreshLocalPacket('answer');
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
      getPacket: () => connectionManager.refreshLocalPacket('offer'),
      loadQr,
      onQrTooLarge: () => setPairingError(dict.privatedrop.qrTooLarge),
    });

  const toggleResponseQr = () =>
    runTogglePairingQr({
      visible: showResponseQr,
      setVisible: setShowResponseQr,
      setDataUrl: setResponseQrUrl,
      getPacket: () => connectionManager.refreshLocalPacket('answer'),
      loadQr,
      onQrTooLarge: () => setPairingError(dict.privatedrop.qrTooLarge),
    });

  const startTransfer = async () => {
    if (fileRoleRef.current !== 'file-sender' || files.length === 0) return;
    if (!connectionManager.isReadyForTransfer()) {
      setPairingError(dict.privatedrop.notConnectedSend);
      return;
    }
    setTransferring(true);
    setPairingError(null);
    try {
      const ch = await connectionManager.waitForDataChannel();
      fileSenderRef.current?.dispose();
      const s = new FileSender(ch, setProgress);
      fileSenderRef.current = s;
      await s.sendFiles(files);
      setStep('complete');
      const meta = connectionManager.getSessionMeta();
      await updateSession(meta.sessionId, { status: 'completed', endedAt: Date.now() });
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatedrop.errorConnection);
    } finally {
      fileSenderRef.current?.dispose();
      fileSenderRef.current = null;
      setTransferring(false);
    }
  };

  const connectionLabel = (() => {
    if (connectionManager.isReadyForTransfer()) return dict.privatedrop.statusConnected;
    const state = connectionManager.getConnectionState();
    if (state === 'failed') return dict.privatedrop.statusFailed;
    if (state === 'connecting' || state === 'new') return dict.privatedrop.statusConnecting;
    return dict.privatedrop.statusSignaling;
  })();

  const canSend = connectionManager.isReadyForTransfer() && files.length > 0 && !transferring;
  const linkReady = connectionManager.isReadyForTransfer();

  const resetAll = () => {
    fileSenderRef.current?.dispose();
    fileSenderRef.current = null;
    receiverRef.current = null;
    connectionManager.close();
    setStep('role');
    setFiles([]);
    setProgress(null);
    setPairingPhase('idle');
    setInviteQrUrl(undefined);
    setResponseQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    setPairingError(null);
  };

  const isHost = fileRole === 'file-sender';

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-1 sm:max-w-lg">
      <PageHeader
        className="text-center"
        title={dict.privatedrop.title}
        subtitle={dict.privatedrop.subtitle}
      />

      {(step === 'pairing' || step === 'transfer') && (
        <div className="mb-6 flex justify-center">
          <ConnectionBadge
            label={dict.privatedrop.connectionStatus}
            statusText={connectionLabel}
            connected={linkReady}
          />
        </div>
      )}

      {pairingError && step !== 'role' ? (
        <p className="mb-4 w-full text-center text-sm text-red-400">{pairingError}</p>
      ) : null}

      {step === 'role' && (
        <Card className="w-full space-y-4 text-center">
          <p className="font-medium">{dict.privatedrop.roleTitle}</p>
          <p className="text-sm text-muted">{dict.privatedrop.roleHint}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={beginFileSender}>{dict.privatedrop.send}</Button>
            <Button variant="secondary" onClick={beginFileReceiver}>
              {dict.privatedrop.receive}
            </Button>
          </div>
        </Card>
      )}

      {step === 'pairing' && (
        <Card className="w-full space-y-6">
          <p className="text-center font-medium">
            {isHost ? dict.privatedrop.pairingHostTitle : dict.privatedrop.pairingGuestTitle}
          </p>

          {isHost ? (
            <>
              <PairingStep step={1} title={dict.privatedrop.stepShare}>
                <ShareSignalingBlock
                  locale={locale}
                  roomCode={session.roomCode}
                  copyLabel={dict.privatedrop.copyInvite}
                  qrDataUrl={inviteQrUrl}
                  qrVisible={showInviteQr}
                  onToggleQr={() => void toggleInviteQr()}
                  onCopy={() => void copyHostInvite()}
                  copied={inviteCopied}
                />
              </PairingStep>
              <PairingStep step={2} title={dict.privatedrop.stepReceive}>
                <SignalingCodeField locale={locale} onApply={(raw) => void applySignalingPayload(raw)} />
              </PairingStep>
            </>
          ) : (
            <>
              <PairingStep step={1} title={dict.privatedrop.stepReceive}>
                <SignalingCodeField locale={locale} onApply={(raw) => void applySignalingPayload(raw)} />
              </PairingStep>
              {pairingPhase === 'guest-has-response' ? (
                <PairingStep step={2} title={dict.privatedrop.stepShare}>
                  <ShareSignalingBlock
                    locale={locale}
                    roomCode={session.roomCode}
                    copyLabel={dict.privatedrop.copyResponse}
                    qrDataUrl={responseQrUrl}
                    qrVisible={showResponseQr}
                    onToggleQr={() => void toggleResponseQr()}
                    onCopy={() => void copyGuestResponse()}
                    copied={responseCopied}
                  />
                </PairingStep>
              ) : null}
            </>
          )}

          <details className="text-xs text-muted">
            <summary className="cursor-pointer select-none">{dict.privatedrop.howItWorks}</summary>
            <p className="mt-2">{dict.privatedrop.iceHint}</p>
            <p className="mt-1">{dict.privatedrop.natWarning}</p>
          </details>

          {session.phase === 'connected' && step === 'pairing' ? (
            <p className="text-center text-sm text-accent">{dict.privatedrop.connected}</p>
          ) : null}
        </Card>
      )}

      {step === 'transfer' && (
        <div className="w-full space-y-4">
          {isHost ? (
            <>
              <DropZone
                label={dict.privatedrop.dropFiles}
                onFiles={(list) => setFiles((f) => [...f, ...list])}
                disabled={transferring}
              />
              <FileQueue
                locale={locale}
                files={files}
                onRemove={(i) => setFiles((f) => f.filter((_, j) => j !== i))}
              />
              <Button className="w-full" disabled={!canSend} onClick={startTransfer}>
                {dict.privatedrop.sendFiles}
              </Button>
            </>
          ) : (
            <Card>
              <p className="text-center text-sm text-muted">{dict.privatedrop.waitingForFiles}</p>
              {progress ? (
                <Progress value={progress.sent} max={progress.total} label={progress.name} />
              ) : (
                <p className="mt-2 text-center text-sm">…</p>
              )}
            </Card>
          )}
          {progress && isHost ? (
            <Progress value={progress.sent} max={progress.total} label={progress.name} />
          ) : null}
        </div>
      )}

      {step === 'complete' && (
        <Card className="w-full space-y-3 text-center">
          <p className="font-medium">{dict.privatedrop.complete}</p>
          <Button onClick={resetAll}>{dict.privatedrop.another}</Button>
        </Card>
      )}
    </div>
  );
}
