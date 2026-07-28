import { describe, expect, it } from 'vitest';
import {
  normalizePoint,
  parseWhiteboardWire,
  serializeWhiteboardWire,
} from '@/tools/whiteboard/protocol';

describe('whiteboard protocol', () => {
  it('parses stroke start', () => {
    const raw = serializeWhiteboardWire({
      type: 'stroke',
      id: 's1',
      color: '#fff',
      width: 3,
      points: [[0.1, 0.2]],
    });
    expect(parseWhiteboardWire(raw)).toEqual({
      type: 'stroke',
      id: 's1',
      color: '#fff',
      width: 3,
      points: [[0.1, 0.2]],
    });
  });

  it('parses clear and leave', () => {
    expect(parseWhiteboardWire('{"type":"clear"}')).toEqual({ type: 'clear' });
    expect(parseWhiteboardWire('{"type":"leave"}')).toEqual({ type: 'leave' });
  });

  it('rejects invalid points', () => {
    expect(
      parseWhiteboardWire(
        JSON.stringify({
          type: 'stroke',
          id: 'x',
          color: '#000',
          width: 2,
          points: [[1.5, 0]],
        }),
      ),
    ).toBeNull();
  });

  it('normalizes pointer coords', () => {
    const rect = { left: 10, top: 20, width: 100, height: 200 } as DOMRect;
    expect(normalizePoint(60, 120, rect)).toEqual([0.5, 0.5]);
  });
});
