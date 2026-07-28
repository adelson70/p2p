import type { BoardStroke } from '@/tools/whiteboard/WhiteboardSession';
import type { BoardPoint } from '@/tools/whiteboard/protocol';

export function drawStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: BoardStroke[],
  width: number,
  height: number,
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#111b21';
  ctx.fillRect(0, 0, width, height);

  for (const stroke of strokes) {
    if (stroke.points.length === 0) continue;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const [x0, y0] = toCanvas(stroke.points[0], width, height);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < stroke.points.length; i++) {
      const [x, y] = toCanvas(stroke.points[i], width, height);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function toCanvas(p: BoardPoint, w: number, h: number): [number, number] {
  return [p[0] * w, p[1] * h];
}
