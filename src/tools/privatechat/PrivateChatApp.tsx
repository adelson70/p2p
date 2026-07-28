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
import type { ChatRole } from '@/tools/privatechat/chatConnectionManager';
import { chatConnectionManager } from '@/tools/privatechat/chatConnectionManager';
import { ChatSession, type ChatMessageItem } from '@/tools/privatechat/ChatSession';
import { ChatComposer, MessageList, ChatThreadHeader } from '@/tools/privatechat/components';
import { useImmersiveShell } from '@/hooks/useImmersiveShell';
import {
  ConnectionBadge,
  PairingStep,
  ShareSignalingBlock,
  SignalingCodeField,
} from '@/tools/privatedrop/components';

type Step = 'role' | 'pairing' | 'chat';

type PairingPhase = 'idle' | 'guest-has-response';

export function PrivateChatApp({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const session = useStore(connectionSession);
  const chatRoleRef = useRef<ChatRole>('host');

  const [step, setStep] = useState<Step>('role');
  const [chatRole, setChatRole] = useState<ChatRole>('host');
  const [pairingPhase, setPairingPhase] = useState<PairingPhase>('idle');
  const [inviteQrUrl, setInviteQrUrl] = useState<string>();
  const [responseQrUrl, setResponseQrUrl] = useState<string>();
  const [showInviteQr, setShowInviteQr] = useState(false);
  const [showResponseQr, setShowResponseQr] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [responseCopied, setResponseCopied] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [peerTyping, setPeerTyping] = useState(false);
  const chatSessionRef = useRef<ChatSession | null>(null);
  const endedRef = useRef(false);
  const typingTimerRef = useRef<number | null>(null);

  const syncChatRole = (role: ChatRole) => {
    chatRoleRef.current = role;
    setChatRole(role);
  };

  const resetAfterChat = useCallback(
    (remoteEnded: boolean) => {
      if (endedRef.current) return;
      endedRef.current = true;

      chatSessionRef.current?.dispose();
      chatSessionRef.current = null;
      chatConnectionManager.dispose();
      setStep('role');
      setPairingPhase('idle');
      setMessages([]);
      setPeerTyping(false);
      setInviteQrUrl(undefined);
      setResponseQrUrl(undefined);
      if (remoteEnded) {
        setPairingError(dict.privatechat.peerLeft);
      } else {
        setPairingError(null);
      }
      endedRef.current = false;
    },
    [dict.privatechat.peerLeft],
  );

  const startChatSession = useCallback(
    (channel: RTCDataChannel) => {
      chatSessionRef.current?.dispose();
      const cs = new ChatSession(channel, {
        onMessagesChange: setMessages,
        onTypingChange: setPeerTyping,
        onPeerLeave: () => {
          resetAfterChat(true);
        },
      });
      chatSessionRef.current = cs;
      setStep('chat');
    },
    [resetAfterChat],
  );

  useEffect(() => {
    chatConnectionManager.setOnDataChannel((ch) => {
      startChatSession(ch);
    });
    return () => {
      chatSessionRef.current?.dispose();
      chatSessionRef.current = null;
      chatConnectionManager.dispose();
    };
  }, [startChatSession]);

  useEffect(() => {
    if (step !== 'chat') return;
    if (session.phase === 'closed') {
      resetAfterChat(session.error === 'remote_hangup');
    }
  }, [session.phase, session.error, step, resetAfterChat]);

  const loadQr = renderSignalingQrDataUrl;

  const beginHost = async () => {
    setPairingError(null);
    syncChatRole('host');
    setPairingPhase('idle');
    setResponseQrUrl(undefined);
    setInviteQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    setStep('pairing');
    try {
      await chatConnectionManager.startAsHost();
    } catch {
      setPairingError(dict.privatechat.errorConnection);
    }
  };

  const beginGuest = () => {
    setPairingError(null);
    syncChatRole('guest');
    setPairingPhase('idle');
    setInviteQrUrl(undefined);
    setResponseQrUrl(undefined);
    setShowInviteQr(false);
    setShowResponseQr(false);
    chatConnectionManager.dispose();
    setStep('pairing');
  };

  const submitInviteAsGuest = async (raw: string) => {
    setPairingError(null);
    try {
      const invite = parseSignalingInput(raw);
      await chatConnectionManager.startAsGuest(invite);
      setResponseQrUrl(undefined);
      setShowResponseQr(false);
      setPairingPhase('guest-has-response');
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatechat.errorConnection);
    }
  };

  const submitResponseAsHost = async (raw: string) => {
    setPairingError(null);
    try {
      const response = parseSignalingInput(raw);
      await chatConnectionManager.applyGuestResponse(response);
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatechat.errorConnection);
    }
  };

  const applySignalingPayload = async (raw: string) => {
    setPairingError(null);
    try {
      const packet = parseSignalingInput(raw);
      if (packet.role === 'offer') {
        if (chatRoleRef.current === 'host') {
          setPairingError(dict.privatechat.wrongRoleOffer);
          return;
        }
        await submitInviteAsGuest(raw);
      } else {
        if (chatRoleRef.current === 'guest') {
          setPairingError(dict.privatechat.wrongRoleAnswer);
          return;
        }
        await submitResponseAsHost(raw);
      }
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatechat.errorConnection);
    }
  };

  const copyInvite = async () => {
    const packet = chatConnectionManager.refreshLocalPacket('offer');
    if (!packet) return;
    await copySignalingToClipboard(packet);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const copyResponse = async () => {
    const packet = chatConnectionManager.refreshLocalPacket('answer');
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
      getPacket: () => chatConnectionManager.refreshLocalPacket('offer'),
      loadQr,
      onQrTooLarge: () => setPairingError(dict.privatedrop.qrTooLarge),
    });

  const toggleResponseQr = () =>
    runTogglePairingQr({
      visible: showResponseQr,
      setVisible: setShowResponseQr,
      setDataUrl: setResponseQrUrl,
      getPacket: () => chatConnectionManager.refreshLocalPacket('answer'),
      loadQr,
      onQrTooLarge: () => setPairingError(dict.privatedrop.qrTooLarge),
    });

  const connectionLabel = (() => {
    if (chatConnectionManager.isReady()) return dict.privatechat.statusConnected;
    if (session.phase === 'reconnecting') return dict.privatechat.statusReconnecting;
    const state = chatConnectionManager.getConnectionState();
    if (state === 'disconnected') return dict.privatechat.statusReconnecting;
    if (state === 'failed') return dict.privatechat.statusFailed;
    if (state === 'connecting' || state === 'new') return dict.privatechat.statusConnecting;
    return dict.privatechat.statusSignaling;
  })();

  const leaveChat = () => {
    chatSessionRef.current?.leave();
    chatConnectionManager.hangUp();
    resetAfterChat(false);
  };

  const sendText = (text: string) => {
    try {
      chatSessionRef.current?.sendText(text);
      chatSessionRef.current?.sendTyping(false);
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatechat.errorConnection);
    }
  };

  const onComposerInput = () => {
    chatSessionRef.current?.sendTyping(true);
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      chatSessionRef.current?.sendTyping(false);
    }, 1500);
  };

  const attachFiles = (files: File[]) => {
    try {
      chatSessionRef.current?.queueFiles(files);
    } catch (e) {
      setPairingError(e instanceof Error ? e.message : dict.privatechat.errorConnection);
    }
  };

  const isHost = chatRole === 'host';

  useImmersiveShell(step === 'chat');

  if (step === 'chat') {
    return (
      <div className="fill-main-immersive flex h-full min-h-0 w-full flex-1 basis-0 flex-col overflow-hidden">
        <ChatThreadHeader
          locale={locale}
          roomCode={session.roomCode}
          statusText={connectionLabel}
          connected={chatConnectionManager.isReady()}
          onLeave={leaveChat}
        />
        {pairingError ? (
          <p className="shrink-0 bg-red-950/40 px-4 py-2 text-center text-sm text-red-300">{pairingError}</p>
        ) : null}
        <div className="relative min-h-0 flex-1 basis-0 overflow-hidden">
          <MessageList
            locale={locale}
            messages={messages}
            peerTyping={peerTyping}
            className="absolute inset-0 h-full max-h-full"
          />
        </div>
        <ChatComposer
          locale={locale}
          disabled={!chatConnectionManager.isReady()}
          onSend={sendText}
          onAttach={attachFiles}
          onTyping={onComposerInput}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full min-h-0 flex-1 flex-col items-center px-4 py-6 sm:max-w-lg md:max-w-md md:py-10">
      <PageHeader
        className="text-center"
        title={dict.privatechat.title}
        subtitle={dict.privatechat.subtitle}
      />

      {step === 'pairing' && (
        <div className="mb-6 flex justify-center">
          <ConnectionBadge
            label={dict.privatechat.connectionStatus}
            statusText={connectionLabel}
            connected={chatConnectionManager.isReady()}
          />
        </div>
      )}

      {pairingError ? (
        <p className="mb-4 w-full text-center text-sm text-red-400">{pairingError}</p>
      ) : null}

      {step === 'role' && (
        <Card className="w-full space-y-4 text-center">
          <p className="font-medium">{dict.privatechat.roleTitle}</p>
          <p className="text-sm text-muted">{dict.privatechat.roleHint}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => void beginHost()}>{dict.privatechat.createRoom}</Button>
            <Button variant="secondary" onClick={beginGuest}>
              {dict.privatechat.joinRoom}
            </Button>
          </div>
        </Card>
      )}

      {step === 'pairing' && (
        <Card className="w-full space-y-6">
          <p className="text-center font-medium">
            {isHost ? dict.privatechat.pairingHostTitle : dict.privatechat.pairingGuestTitle}
          </p>

          {isHost ? (
            <>
              <PairingStep step={1} title={dict.privatechat.stepShare}>
                <ShareSignalingBlock
                  locale={locale}
                  roomCode={session.roomCode}
                  copyLabel={dict.privatechat.copyInvite}
                  qrDataUrl={inviteQrUrl}
                  qrVisible={showInviteQr}
                  onToggleQr={() => void toggleInviteQr()}
                  onCopy={() => void copyInvite()}
                  copied={inviteCopied}
                />
              </PairingStep>
              <PairingStep step={2} title={dict.privatechat.stepReceive}>
                <SignalingCodeField locale={locale} onApply={(raw) => void applySignalingPayload(raw)} />
              </PairingStep>
            </>
          ) : (
            <>
              <PairingStep step={1} title={dict.privatechat.stepReceive}>
                <SignalingCodeField locale={locale} onApply={(raw) => void applySignalingPayload(raw)} />
              </PairingStep>
              {pairingPhase === 'guest-has-response' ? (
                <PairingStep step={2} title={dict.privatechat.stepShare}>
                  <ShareSignalingBlock
                    locale={locale}
                    roomCode={session.roomCode}
                    copyLabel={dict.privatechat.copyResponse}
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
            <summary className="cursor-pointer select-none">{dict.privatechat.howItWorks}</summary>
            <p className="mt-2">{dict.privatechat.iceHint}</p>
          </details>
        </Card>
      )}
    </div>
  );
}
