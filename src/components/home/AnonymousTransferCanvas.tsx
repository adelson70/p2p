import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import {
  readCanvasPalette,
  rgba,
  subscribeThemeChange,
  type CanvasPalette,
} from '@/components/home/canvasTheme';
import { CLOUD_ICON_OUTLINE_PATH, CLOUD_ICON_VIEWBOX } from '@/components/home/cloudIconPath';

type Orb = {
  lane: number;
  phase: number;
  speed: number;
  radius: number;
  hue: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function drawNoCloudBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  label: string,
  t: number,
  pal: CanvasPalette,
): void {
  const cloudW = Math.min(152, Math.max(116, w * 0.32));
  const pulse = 0.88 + 0.12 * Math.sin(t * 0.0015);
  const scale = cloudW / CLOUD_ICON_VIEWBOX;
  const cloudPath = new Path2D(CLOUD_ICON_OUTLINE_PATH);

  ctx.save();
  ctx.translate(cx - cloudW / 2, cy - cloudW / 2);
  ctx.scale(scale, scale);

  ctx.fillStyle = pal.mode === 'light' ? pal.surface : pal.bgAlt;
  ctx.fill(cloudPath);

  ctx.strokeStyle = rgba(
    pal.accentRgb,
    (pal.mode === 'light' ? 0.55 : 0.7) * pulse,
  );
  ctx.lineWidth = 1.1 / scale;
  ctx.stroke(cloudPath);

  ctx.restore();

  ctx.fillStyle = pal.foreground;
  ctx.globalAlpha = 0.92 + 0.08 * Math.sin(t * 0.0015);
  ctx.font = `600 ${Math.max(9, cloudW * 0.105)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy + cloudW * 0.05);
  ctx.globalAlpha = 1;
}

function drawBrowserPeerNode(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  label: string,
  t: number,
  side: 'left' | 'right',
  pal: CanvasPalette,
): void {
  const breathe = 1 + Math.sin(t * 0.002 + (side === 'left' ? 0 : 1.2)) * 0.04;
  const s = size * breathe;
  const bw = s * 2.4;
  const bh = s * 2;
  const left = cx - bw / 2;
  const top = cy - bh / 2;
  const radius = Math.max(4, s * 0.2);

  const outer = ctx.createRadialGradient(cx, cy, s * 0.4, cx, cy, s * 3.2);
  outer.addColorStop(0, rgba(pal.accentRgb, pal.mode === 'light' ? 0.16 : 0.22));
  outer.addColorStop(1, rgba(pal.accentRgb, 0));
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(cx, cy, s * 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = pal.surface;
  ctx.strokeStyle = pal.glassStroke;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(left, top, bw, bh, radius);
  ctx.fill();
  ctx.stroke();

  const titleH = bh * 0.28;
  ctx.fillStyle = pal.mode === 'light' ? pal.bgAlt : 'rgba(255, 255, 255, 0.07)';
  ctx.beginPath();
  ctx.roundRect(left, top, bw, titleH + radius * 0.35, radius);
  ctx.fill();
  ctx.fillRect(left, top + titleH - 1, bw, 2);

  const dotY = top + titleH * 0.5;
  const dotR = Math.max(2.2, s * 0.085);
  const dotGap = dotR * 2.5;
  const dotsX = side === 'left' ? left + s * 0.32 : left + bw - s * 0.32 - dotGap * 2;
  const traffic: [number, number, number][] = [
    [239, 68, 68],
    [234, 179, 8],
    [34, 197, 94],
  ];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = rgba(traffic[i], pal.mode === 'light' ? 0.88 : 0.7);
    ctx.beginPath();
    ctx.arc(dotsX + i * dotGap, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();
  }

  const urlPad = s * 0.22;
  const urlTop = top + titleH + s * 0.1;
  const urlH = Math.max(8, s * 0.36);
  ctx.fillStyle = pal.mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.roundRect(left + urlPad, urlTop, bw - urlPad * 2, urlH, urlH * 0.45);
  ctx.fill();

  const lockX = left + urlPad + urlH * 0.55;
  const lockY = urlTop + urlH / 2;
  ctx.fillStyle = rgba(pal.accentRgb, 0.95);
  ctx.beginPath();
  ctx.arc(lockX, lockY, urlH * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = pal.muted;
  const urlBarX = lockX + urlH * 0.45;
  const urlBarW = bw - (urlBarX - left) - urlPad;
  ctx.beginPath();
  ctx.roundRect(urlBarX, urlTop + urlH * 0.38, urlBarW, urlH * 0.24, urlH * 0.1);
  ctx.fill();

  const contentY = urlTop + urlH + (bh - (urlTop + urlH - top)) * 0.42;
  ctx.fillStyle = pal.foreground;
  ctx.font = `600 ${Math.max(10, s * 0.36)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, contentY);

  const pulse = 0.35 + 0.65 * Math.sin(t * 0.003 + (side === 'left' ? 0 : 1.4));
  ctx.fillStyle = rgba(pal.accentRgb, 0.2 + pulse * 0.4);
  const pillW = bw * 0.42;
  const pillH = Math.max(3, s * 0.1);
  ctx.beginPath();
  ctx.roundRect(cx - pillW / 2, top + bh - s * 0.26, pillW, pillH, pillH / 2);
  ctx.fill();
}

export function AnonymousTransferCanvas({
  locale,
  className = '',
}: {
  locale: Locale;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const orbsRef = useRef<Orb[]>([]);
  const timeRef = useRef(0);
  const paletteRef = useRef<CanvasPalette>(readCanvasPalette());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const refreshPalette = () => {
      paletteRef.current = readCanvasPalette();
    };
    refreshPalette();
    const unsubTheme = subscribeThemeChange(refreshPalette);

    orbsRef.current = Array.from({ length: reduced ? 5 : 12 }, (_, i) => ({
      lane: 0.25 + (i / 12) * 0.5 + (Math.random() - 0.5) * 0.08,
      phase: Math.random(),
      speed: 0.00012 + Math.random() * 0.0001,
      radius: 3 + Math.random() * 2.5,
      hue: paletteRef.current.mode === 'light' ? 215 + Math.random() * 15 : 205 + Math.random() * 25,
    }));

    const curvePoint = (
      w: number,
      h: number,
      lane: number,
      t: number,
      wave: number,
    ): { x: number; y: number } => {
      const margin = w * 0.11;
      const x0 = margin;
      const x1 = w - margin;
      const yBase = h * 0.5 + (lane - 0.5) * h * 0.18;
      const x = x0 + (x1 - x0) * t;
      const waveY = Math.sin(t * Math.PI * 2 + wave) * h * 0.04;
      return { x, y: yBase + waveY };
    };

    const drawBackground = (w: number, h: number, t: number, pal: CanvasPalette) => {
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, pal.bg);
      bg.addColorStop(0.55, pal.surface);
      bg.addColorStop(1, pal.bgAlt);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        { x: 0.2, y: 0.35, r: 0.45 },
        { x: 0.78, y: 0.55, r: 0.4 },
        { x: 0.5, y: 0.15, r: 0.25 },
      ];
      const [r, g, b] = pal.accentRgb;
      for (const bl of blobs) {
        const bx = bl.x * w + Math.sin(t * 0.0003 + bl.x * 10) * 12;
        const by = bl.y * h + Math.cos(t * 0.00025 + bl.y * 8) * 10;
        const gr = ctx.createRadialGradient(bx, by, 0, bx, by, bl.r * Math.min(w, h));
        gr.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${pal.blobAlpha})`);
        gr.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const drawStream = (
      w: number,
      h: number,
      lane: number,
      t: number,
      alpha: number,
      pal: CanvasPalette,
    ) => {
      const steps = 48;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const pt = curvePoint(w, h, lane, i / steps, t * 0.0008);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      const [r, g, b] = pal.accentRgb;
      const grad = ctx.createLinearGradient(0, h * 0.5, w, h * 0.5);
      const m = alpha * pal.streamAlpha;
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${m * 0.2})`);
      grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${m * 0.55})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${m * 0.2})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = pal.mode === 'light' ? 2.5 : 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = rgba(pal.accentRgb, pal.mode === 'light' ? 0.2 : 0.35);
      ctx.shadowBlur = pal.mode === 'light' ? 8 : 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawOrb = (
      w: number,
      h: number,
      orb: Orb,
      globalT: number,
      forward: boolean,
      pal: CanvasPalette,
    ) => {
      const raw = (orb.phase + globalT * orb.speed * (forward ? 1 : -1)) % 1;
      const t = raw < 0 ? raw + 1 : raw;
      const eased = easeInOutSine(t);
      const pt = curvePoint(w, h, orb.lane, eased, globalT * 0.0005 + orb.phase * 6);

      const tailSteps = 6;
      const orbLight = pal.mode === 'light' ? 58 : 70;
      for (let i = tailSteps; i >= 1; i--) {
        const tt = Math.max(0, t - i * 0.012);
        const te = easeInOutSine(tt);
        const tp = curvePoint(w, h, orb.lane, te, globalT * 0.0005 + orb.phase * 6);
        const a = (1 - i / (tailSteps + 1)) * (pal.mode === 'light' ? 0.35 : 0.25);
        ctx.fillStyle = `hsla(${orb.hue}, 85%, ${orbLight}%, ${a})`;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, orb.radius * (1 - i * 0.08), 0, Math.PI * 2);
        ctx.fill();
      }

      const glow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, orb.radius * 5);
      glow.addColorStop(0, `hsla(${orb.hue}, 90%, ${orbLight + 8}%, 0.9)`);
      glow.addColorStop(0.45, rgba(pal.accentRgb, 0.28));
      glow.addColorStop(1, rgba(pal.accentRgb, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, orb.radius * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = pal.mode === 'light' ? pal.foreground : 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, orb.radius * 0.55, 0, Math.PI * 2);
      ctx.fill();
    };

    const paint = (now: number) => {
      if (!reduced) timeRef.current = now;
      const t = timeRef.current;
      const pal = paletteRef.current;

      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const cw = Math.floor(w * dpr);
      const ch = Math.floor(h * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      drawBackground(w, h, t, pal);

      const margin = w * 0.11;
      const nodeSize = Math.min(w * 0.078, h * 0.17, 46);
      const leftX = margin;
      const rightX = w - margin;
      const midY = h * 0.5;

      for (let i = 0; i < 3; i++) {
        const lane = 0.38 + i * 0.12;
        const pulse = 0.55 + 0.45 * Math.sin(t * 0.001 + i * 1.1);
        drawStream(w, h, lane, t + i * 400, pulse * 0.5, pal);
      }

      const cloudY = h * 0.18;
      const cloudX = w * 0.5;
      drawNoCloudBadge(ctx, cloudX, cloudY, w, dict.home.visualNoServer, t, pal);

      drawBrowserPeerNode(ctx, leftX, midY, nodeSize, dict.home.visualPeerA, t, 'left', pal);
      drawBrowserPeerNode(ctx, rightX, midY, nodeSize, dict.home.visualPeerB, t, 'right', pal);

      if (!reduced) {
        for (let i = 0; i < orbsRef.current.length; i++) {
          drawOrb(w, h, orbsRef.current[i], t, i % 2 === 0, pal);
        }
      } else {
        for (let i = 0; i < orbsRef.current.length; i++) {
          const orb = orbsRef.current[i];
          const pt = curvePoint(w, h, orb.lane, 0.3 + i * 0.1, 0);
          ctx.fillStyle = rgba(pal.accentRgb, 0.55);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, orb.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = pal.muted;
      ctx.font = `500 ${Math.max(10, w * 0.022)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.75 + 0.25 * Math.sin(t * 0.0012);
      ctx.fillText(dict.home.visualBadge, w * 0.5, h * 0.88);
      ctx.globalAlpha = 1;
    };

    let running = true;
    const loop = (now: number) => {
      if (!running) return;
      paint(now);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => paint(timeRef.current));
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      unsubTheme();
    };
  }, [
    dict.home.visualBadge,
    dict.home.visualNoServer,
    dict.home.visualPeerA,
    dict.home.visualPeerB,
  ]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg shadow-black/5 dark:shadow-black/30 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block h-full min-h-[240px] w-full sm:min-h-[280px]"
        aria-label={dict.home.visualAria}
        role="img"
      />
    </div>
  );
}
