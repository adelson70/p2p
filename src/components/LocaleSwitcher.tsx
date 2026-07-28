import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { localeDefinitions, locales, localePath } from '@/i18n/config';

export function LocaleSwitcher({
  locale,
  currentPath = '',
}: {
  locale: Locale;
  currentPath?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = localeDefinitions[locale];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        {current.nativeName}
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 max-h-64 min-w-[10rem] overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {locales.map((loc) => {
            const def = localeDefinitions[loc];
            const active = loc === locale;
            return (
              <li key={loc} role="option" aria-selected={active}>
                <a
                  href={localePath(loc, currentPath || '/')}
                  className={`block px-3 py-2 text-sm ${active ? 'bg-accent-muted text-accent' : 'text-muted hover:bg-white/5 hover:text-foreground'}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="font-medium">{def.nativeName}</span>
                  <span className="ms-2 text-xs opacity-70">{def.code}</span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
