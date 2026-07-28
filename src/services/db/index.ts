import { openDB, type IDBPDatabase } from 'idb';
import type { PrivateToolsDB, SessionRecord, TransferStateRecord, ChatMessageRecord } from './schema';
import { DB_NAME, DB_VERSION } from './schema';

let dbPromise: Promise<IDBPDatabase<PrivateToolsDB>> | null = null;

export function getDb(): Promise<IDBPDatabase<PrivateToolsDB>> {
  if (!dbPromise) {
    dbPromise = openDB<PrivateToolsDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'id' });
          store.createIndex('by-started', 'startedAt');
        }
        if (!db.objectStoreNames.contains('transfer_state')) {
          db.createObjectStore('transfer_state', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('chat_messages')) {
          const chatStore = db.createObjectStore('chat_messages', { keyPath: 'id' });
          chatStore.createIndex('by-session', 'sessionId');
        }
      },
    });
  }
  return dbPromise;
}

export async function putSession(session: SessionRecord): Promise<void> {
  const db = await getDb();
  await db.put('sessions', session);
}

export async function updateSession(
  id: string,
  patch: Partial<SessionRecord>,
): Promise<void> {
  const db = await getDb();
  const existing = await db.get('sessions', id);
  if (!existing) return;
  await db.put('sessions', { ...existing, ...patch });
}

export async function listSessions(limit = 50): Promise<SessionRecord[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex('sessions', 'by-started');
  return all.sort((a, b) => b.startedAt - a.startedAt).slice(0, limit);
}

export async function putTransferState(state: TransferStateRecord): Promise<void> {
  const db = await getDb();
  await db.put('transfer_state', state);
}

export async function putChatMessage(message: ChatMessageRecord): Promise<void> {
  const db = await getDb();
  await db.put('chat_messages', message);
}

export async function listChatMessagesBySession(sessionId: string): Promise<ChatMessageRecord[]> {
  const db = await getDb();
  const rows = await db.getAllFromIndex('chat_messages', 'by-session', sessionId);
  return rows.sort((a, b) => a.sentAt - b.sentAt);
}

export async function clearAllUserData(): Promise<void> {
  const db = await getDb();
  await db.clear('sessions');
  await db.clear('transfer_state');
  await db.clear('preferences');
  await db.clear('chat_messages');
}
