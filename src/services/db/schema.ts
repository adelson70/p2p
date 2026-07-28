export const DB_NAME = 'private-tools';
export const DB_VERSION = 2;

export interface SessionRecord {
  id: string;
  toolId: string;
  roomCode?: string;
  role?: 'send' | 'receive';
  startedAt: number;
  endedAt?: number;
  status: 'active' | 'completed' | 'failed';
  summary?: Record<string, unknown>;
}

export interface TransferStateRecord {
  id: string;
  transferId: string;
  fileName: string;
  chunksSent: number;
  totalChunks: number;
  updatedAt: number;
}

export interface ChatMessageRecord {
  id: string;
  sessionId: string;
  roomCode?: string;
  direction: 'out' | 'in';
  body: string;
  sentAt: number;
}

export interface PreferenceRecord {
  key: string;
  value: unknown;
}

interface PrivateToolsDB {
  sessions: {
    key: string;
    value: SessionRecord;
    indexes: { 'by-started': number };
  };
  transfer_state: {
    key: string;
    value: TransferStateRecord;
  };
  preferences: {
    key: string;
    value: PreferenceRecord;
  };
  chat_messages: {
    key: string;
    value: ChatMessageRecord;
    indexes: { 'by-session': string };
  };
}

export type { PrivateToolsDB };
