import type { ConnectionPhase } from './connectionSession';
import type { SignalingPacket, SignalingRole } from './signalingManual';

/** Host / caller / file sender — creates the WebRTC offer. */
export type PairingSide = 'offerer' | 'answerer';

export type PairingApplyAction =
  | { kind: 'noop' }
  | { kind: 'apply_offer' }
  | { kind: 'apply_answer' }
  | { kind: 'wrong_role_offer' }
  | { kind: 'wrong_role_answer' };

export function resolvePairingApplyAction(
  packetRole: SignalingRole,
  side: PairingSide,
  phase: ConnectionPhase,
  sessionReady: boolean,
  answererSharedResponse = false,
): PairingApplyAction {
  if (sessionReady || phase === 'connected' || phase === 'reconnecting') {
    return { kind: 'noop' };
  }

  if (packetRole === 'offer') {
    if (side === 'offerer') {
      if (phase === 'creating' || phase === 'waitingAnswer' || phase === 'connecting') {
        return { kind: 'noop' };
      }
      return { kind: 'wrong_role_offer' };
    }
    if (answererSharedResponse || phase === 'connecting') {
      return { kind: 'noop' };
    }
    return { kind: 'apply_offer' };
  }

  if (side === 'answerer') {
    if (answererSharedResponse || phase === 'connecting') {
      return { kind: 'noop' };
    }
    return { kind: 'wrong_role_answer' };
  }

  if (phase === 'connecting') {
    return { kind: 'noop' };
  }
  return { kind: 'apply_answer' };
}

export async function runPairingApply(
  packet: SignalingPacket,
  raw: string,
  options: {
    side: PairingSide;
    phase: ConnectionPhase;
    sessionReady: boolean;
    answererSharedResponse: boolean;
    onApplyOffer: (raw: string) => Promise<void>;
    onApplyAnswer: (raw: string) => Promise<void>;
    onWrongRoleOffer: () => void;
    onWrongRoleAnswer: () => void;
  },
): Promise<void> {
  const action = resolvePairingApplyAction(
    packet.role,
    options.side,
    options.phase,
    options.sessionReady,
    options.answererSharedResponse,
  );

  switch (action.kind) {
    case 'noop':
      return;
    case 'apply_offer':
      await options.onApplyOffer(raw);
      return;
    case 'apply_answer':
      await options.onApplyAnswer(raw);
      return;
    case 'wrong_role_offer':
      options.onWrongRoleOffer();
      return;
    case 'wrong_role_answer':
      options.onWrongRoleAnswer();
      return;
  }
}
