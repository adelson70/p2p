import { useEffect, useRef, type RefObject } from 'react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { EMOJI_GROUPS } from '@/tools/privatechat/emojiData';

export function insertTextAtCursor(el: HTMLTextAreaElement, text: string): void {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? start;
  const next = el.value.slice(0, start) + text + el.value.slice(end);
  el.value = next;
  const pos = start + text.length;
  el.setSelectionRange(pos, pos);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

export function EmojiPicker({
  locale,
  open,
  onClose,
  onPick,
  anchorRef,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
  anchorRef: RefObject<HTMLElement | null>;
}) {
  const dict = getDictionary(locale);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || anchorRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={dict.privatechat.emojiPicker}
      className="absolute bottom-full left-0 z-20 mb-2 w-[min(100vw-1.5rem,22rem)] rounded-xl border border-white/10 bg-[#233138] shadow-xl"
    >
      <div className="max-h-56 overflow-y-auto p-2">
        {EMOJI_GROUPS.map((group) => (
          <div key={group.id} className="mb-2 last:mb-0">
            <div className="grid grid-cols-8 gap-0.5">
              {group.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="flex h-9 w-full items-center justify-center rounded-md text-xl hover:bg-white/10"
                  onClick={() => onPick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
