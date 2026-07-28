export function generateRoomCode(): string {
  const part = () =>
    Math.floor(1000 + Math.random() * 9000)
      .toString()
      .padStart(4, '0');
  return `${part()}-${part()}`;
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}
