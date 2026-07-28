import { atom } from 'nanostores';
import type { SignalingPacket } from './signalingManual';

export type ConnectionPhase =
  | 'idle'
  | 'creating'
  | 'waitingAnswer'
  | 'connecting'
  | 'connected'
  | 'failed'
  | 'closed';

export interface ConnectionSessionState {
  phase: ConnectionPhase;
  roomCode?: string;
  sessionId?: string;
  role?: 'send' | 'receive';
  localPacket?: SignalingPacket;
  error?: string;
}

export const connectionSession = atom<ConnectionSessionState>({ phase: 'idle' });

export function resetConnectionSession(): void {
  connectionSession.set({ phase: 'idle' });
}

export function patchConnectionSession(patch: Partial<ConnectionSessionState>): void {
  connectionSession.set({ ...connectionSession.get(), ...patch });
}
