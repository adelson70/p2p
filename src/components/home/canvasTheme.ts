export type ResolvedTheme = 'light' | 'dark';

export interface CanvasPalette {
  mode: ResolvedTheme;
  bg: string;
  bgAlt: string;
  surface: string;
  foreground: string;
  muted: string;
  accent: string;
  accentRgb: [number, number, number];
  blobAlpha: number;
  streamAlpha: number;
  glassHighlight: string;
  glassLow: string;
  glassStroke: string;
  shadow: string;
}

function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function parseHexColor(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim();
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return [r, g, b];
  }
  if (h.length >= 6) {
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  return [59, 130, 246];
}

export function getResolvedTheme(): ResolvedTheme {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light') return 'light';
  if (attr === 'dark') return 'dark';
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function readCanvasPalette(): CanvasPalette {
  const mode = getResolvedTheme();
  const bg = cssVar('--pt-bg', mode === 'light' ? '#fafafa' : '#09090b');
  const surface = cssVar('--pt-surface', mode === 'light' ? '#ffffff' : '#0f0f12');
  const raised = cssVar('--pt-surface-raised', mode === 'light' ? '#f4f4f5' : '#18181b');
  const foreground = cssVar('--pt-foreground', mode === 'light' ? '#09090b' : '#fafafa');
  const muted = cssVar('--pt-muted', mode === 'light' ? '#71717a' : '#a1a1aa');
  const accent = cssVar('--pt-accent', mode === 'light' ? '#2563eb' : '#3b82f6');
  const accentRgb = parseHexColor(accent);

  const isLight = mode === 'light';

  return {
    mode,
    bg,
    bgAlt: raised,
    surface,
    foreground,
    muted,
    accent,
    accentRgb,
    blobAlpha: isLight ? 0.14 : 0.08,
    streamAlpha: isLight ? 0.55 : 0.4,
    glassHighlight: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.14)',
    glassLow: isLight ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.03)',
    glassStroke: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(148, 163, 184, 0.35)',
    shadow: isLight ? 'rgba(37, 99, 235, 0.25)' : 'rgba(59, 130, 246, 0.35)',
  };
}

export function rgba(rgb: [number, number, number], alpha: number): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

/** Re-run when user toggles theme or system scheme changes. */
export function subscribeThemeChange(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onMq = () => onChange();
  mq.addEventListener('change', onMq);

  const obs = new MutationObserver(onMq);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return () => {
    mq.removeEventListener('change', onMq);
    obs.disconnect();
  };
}
