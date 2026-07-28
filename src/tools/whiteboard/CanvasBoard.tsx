import { useCallback, useEffect, useRef, type RefObject } from 'react';
import type { BoardStroke } from '@/tools/whiteboard/WhiteboardSession';
import { normalizePoint, type BoardPoint } from '@/tools/whiteboard/protocol';
import { drawStrokes } from '@/tools/whiteboard/canvasDraw';

const MOVE_THROTTLE_MS = 24;

export function CanvasBoard({
  strokes,
  disabled,
  exportRef,
  onBeginStroke,
  onAppendPoints,
  onEndStroke,
}: {
  strokes: BoardStroke[];
  disabled?: boolean;
  exportRef?: RefObject<HTMLCanvasElement | null>;
  onBeginStroke: (id: string, point: BoardPoint) => void;
  onAppendPoints: (id: string, points: BoardPoint[]) => void;
  onEndStroke: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const pendingRef = useRef<BoardPoint[]>([]);
  const lastMoveRef = useRef(0);

  const assignCanvasRef = (el: HTMLCanvasElement | null) => {
    canvasRef.current = el;
    if (exportRef) exportRef.current = el;
  };

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawStrokes(ctx, strokes, canvas.width, canvas.height);
  }, [strokes]);

  useEffect(() => {
    paint();
  }, [paint]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        paint();
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [paint]);

  const flushPending = () => {
    const id = activeIdRef.current;
    if (!id || pendingRef.current.length === 0) return;
    const batch = pendingRef.current.splice(0, pendingRef.current.length);
    onAppendPoints(id, batch);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const id = crypto.randomUUID();
    activeIdRef.current = id;
    pendingRef.current = [];
    canvas.setPointerCapture(e.pointerId);
    onBeginStroke(id, normalizePoint(e.clientX, e.clientY, rect));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const id = activeIdRef.current;
    if (!id || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pendingRef.current.push(normalizePoint(e.clientX, e.clientY, rect));
    const now = performance.now();
    if (now - lastMoveRef.current >= MOVE_THROTTLE_MS && pendingRef.current.length > 0) {
      lastMoveRef.current = now;
      flushPending();
    }
  };

  const endPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const id = activeIdRef.current;
    if (!id) return;
    flushPending();
    onEndStroke(id);
    activeIdRef.current = null;
    pendingRef.current = [];
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-0 flex-1 bg-[#0b141a]">
      <canvas
        ref={assignCanvasRef}
        className="absolute inset-0 touch-none cursor-crosshair"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      />
    </div>
  );
}
