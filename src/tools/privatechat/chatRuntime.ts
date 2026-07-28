import type { ChatSession } from '@/tools/privatechat/ChatSession';
import type { ChatRole } from '@/tools/privatechat/chatConnectionManager';

let liveSession: ChatSession | null = null;
let liveRole: ChatRole | null = null;

export function getLiveChatSession(): ChatSession | null {
  return liveSession;
}

export function setLiveChatSession(session: ChatSession | null, role?: ChatRole): void {
  liveSession = session;
  if (role) liveRole = role;
}

export function getLiveChatRole(): ChatRole | null {
  return liveRole;
}

export function clearLiveChatSession(): void {
  liveSession?.dispose();
  liveSession = null;
  liveRole = null;
}
