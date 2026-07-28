import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { Button } from '@/components/Button';
import {
  applyAdblockDocumentState,
  detectAdblockActive,
  detectCosmeticBait,
} from '@/features/adblock/detectAdblock';

const RECHECK_MS = 1_500;

declare global {
  interface Window {
    __PT_ADBLOCK?: boolean;
  }
}

interface Props {
  locale: Locale;
}

export function AdblockGate({ locale }: Props) {
  const dict = getDictionary(locale);
  const copy = dict.adblock;
  const [blocked, setBlocked] = useState(() =>
    typeof window !== 'undefined' ? window.__PT_ADBLOCK === true : false,
  );
  const [checking, setChecking] = useState(false);

  const runCheck = useCallback(async () => {
    setChecking(true);
    try {
      const active = await detectAdblockActive();
      window.__PT_ADBLOCK = active;
      setBlocked(active);
      applyAdblockDocumentState(active);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void runCheck();
    const id = window.setInterval(() => void runCheck(), RECHECK_MS);
    return () => window.clearInterval(id);
  }, [runCheck]);

  useEffect(() => {
    applyAdblockDocumentState(blocked);
    return () => applyAdblockDocumentState(false);
  }, [blocked]);

  if (!blocked) return null;

  return (
    <div
      data-pt-adblock-overlay
      className="fixed inset-0 z-[2147483647] flex items-center justify-center overflow-y-auto bg-[#050506]/95 p-4 backdrop-blur-md"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="pt-adblock-title"
      aria-describedby="pt-adblock-desc"
    >
      <div className="w-full max-w-lg rounded-2xl border border-red-500/40 bg-[#0c0c0e] p-6 shadow-2xl shadow-red-950/50 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400">{copy.badge}</p>
        <h1 id="pt-adblock-title" className="mt-2 text-2xl font-semibold text-[#fafafa]">
          {copy.title}
        </h1>
        <p id="pt-adblock-desc" className="mt-3 text-sm leading-relaxed text-[#a1a1aa]">
          {copy.body}
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#d4d4d8]">
          <li>{copy.tipBrave}</li>
          <li>{copy.tipAdguard}</li>
          <li>{copy.tipGeneric}</li>
        </ul>
        <p className="mt-4 text-xs text-[#71717a]">{copy.why}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full sm:flex-1"
            disabled={checking}
            onClick={() => void runCheck()}
          >
            {checking ? copy.rechecking : copy.recheck}
          </Button>
        </div>
        {detectCosmeticBait() ? (
          <p className="mt-3 text-center text-xs text-red-300/90">{copy.signalCosmetic}</p>
        ) : null}
      </div>
    </div>
  );
}
