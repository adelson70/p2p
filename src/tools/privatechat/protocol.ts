export const MAX_TEXT_LENGTH = 32_000;

export type ChatTextMessage = {
  type: 'text';
  id: string;
  body: string;
  sentAt: number;
};

export type ChatTypingMessage = {
  type: 'typing';
  active: boolean;
};

export type ChatLeaveMessage = {
  type: 'leave';
};

export type ChatWireMessage = ChatTextMessage | ChatTypingMessage | ChatLeaveMessage;

const CHAT_TYPES = new Set(['text', 'typing', 'leave']);

export function isChatWireMessage(msg: { type: string }): msg is ChatWireMessage {
  return CHAT_TYPES.has(msg.type);
}

export function parseChatWire(raw: string): ChatWireMessage | null {
  try {
    const data = JSON.parse(raw) as { type: string };
    if (isChatWireMessage(data)) return data;
  } catch {
    // not chat JSON
  }
  return null;
}

export function serializeChatWire(msg: ChatWireMessage): string {
  return JSON.stringify(msg);
}

export function isFileControlType(type: string): boolean {
  return type === 'meta' || type === 'ack' || type === 'done' || type === 'error' || type === 'cancel';
}
