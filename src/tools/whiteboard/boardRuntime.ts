import type { WhiteboardSession } from '@/tools/whiteboard/WhiteboardSession';
import type { BoardRole } from '@/tools/whiteboard/whiteboardConnectionManager';

let liveSession: WhiteboardSession | null = null;
let liveRole: BoardRole | null = null;

export function getLiveBoardSession(): WhiteboardSession | null {
  return liveSession;
}

export function setLiveBoardSession(session: WhiteboardSession | null, role?: BoardRole): void {
  liveSession = session;
  if (role) liveRole = role;
}

export function getLiveBoardRole(): BoardRole | null {
  return liveRole;
}

export function clearLiveBoardSession(): void {
  liveSession?.dispose();
  liveSession = null;
  liveRole = null;
}
