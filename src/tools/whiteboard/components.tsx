import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { Button } from '@/components/Button';

export const BOARD_COLORS = ['#e9edef', '#53bdeb', '#25d366', '#ffd279', '#ff6b6b', '#c678dd', '#000000'];

export const BOARD_WIDTHS = [2, 4, 8, 14];

export function BoardToolbar({
  locale,
  color,
  lineWidth,
  disabled,
  onColor,
  onWidth,
  onClear,
  onUndo,
  onExport,
}: {
  locale: Locale;
  color: string;
  lineWidth: number;
  disabled?: boolean;
  onColor: (c: string) => void;
  onWidth: (w: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onExport: () => void;
}) {
  const dict = getDictionary(locale);
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border bg-[#202c33] px-3 py-2 md:px-6">
      <div className="flex items-center gap-1">
        {BOARD_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            disabled={disabled}
            aria-label={dict.whiteboard.color}
            className={`h-7 w-7 rounded-full border-2 ${color === c ? 'border-[#53bdeb]' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
            onClick={() => onColor(c)}
          />
        ))}
      </div>
      <div className="flex items-center gap-1">
        {BOARD_WIDTHS.map((w) => (
          <button
            key={w}
            type="button"
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-md ${lineWidth === w ? 'bg-white/15' : 'hover:bg-white/5'}`}
            onClick={() => onWidth(w)}
            aria-label={dict.whiteboard.brushSize}
          >
            <span
              className="rounded-full bg-[#e9edef]"
              style={{ width: Math.min(w + 2, 12), height: Math.min(w + 2, 12) }}
            />
          </button>
        ))}
      </div>
      <div className="ms-auto flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" disabled={disabled} onClick={onUndo}>
          {dict.whiteboard.undo}
        </Button>
        <Button size="sm" variant="secondary" disabled={disabled} onClick={onClear}>
          {dict.whiteboard.clearBoard}
        </Button>
        <Button size="sm" variant="secondary" disabled={disabled} onClick={onExport}>
          {dict.whiteboard.exportPng}
        </Button>
      </div>
    </div>
  );
}

export function BoardHeader({
  locale,
  roomCode,
  statusText,
  connected,
  onLeave,
}: {
  locale: Locale;
  roomCode?: string;
  statusText: string;
  connected: boolean;
  onLeave: () => void;
}) {
  const dict = getDictionary(locale);
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-[#202c33] px-4 py-3 md:px-6">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-medium text-[#e9edef]">{dict.whiteboard.title}</h2>
        <p className="truncate text-xs text-[#8696a0]">
          {roomCode ? (
            <>
              <span className="font-mono tracking-wider">{roomCode}</span>
              <span className="mx-1.5">·</span>
            </>
          ) : null}
          {statusText}
          {connected ? (
            <>
              <span className="mx-1.5">·</span>
              <span className="text-[#53bdeb]">{dict.whiteboard.encryptionBadge}</span>
            </>
          ) : null}
        </p>
      </div>
      <details className="relative text-xs text-[#8696a0]">
        <summary className="cursor-pointer list-none rounded-lg px-2 py-1 hover:bg-white/5 [&::-webkit-details-marker]:hidden">
          {dict.whiteboard.privacyShort}
        </summary>
        <p className="absolute right-0 top-full z-10 mt-1 max-w-xs rounded-lg border border-border bg-surface p-3 text-[11px] leading-relaxed shadow-lg">
          {dict.whiteboard.encryptionHint}
        </p>
      </details>
      <Button size="sm" variant="danger" onClick={onLeave}>
        {dict.whiteboard.leave}
      </Button>
    </header>
  );
}
