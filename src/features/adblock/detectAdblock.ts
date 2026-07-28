const BAIT_CLASS =
  'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links advertisement sponsored-content adsbox ad-placement';

/** Not named `ads.js` — generic lists block that path even on allowlisted sites. */
const PROBE_SCRIPT_URL = '/connectivity-probe.js';

export function isCosmeticBaitBlocked(
  height: number,
  width: number,
  cs: Pick<CSSStyleDeclaration, 'display' | 'visibility' | 'opacity'>,
): boolean {
  return (
    height === 0 ||
    width === 0 ||
    cs.display === 'none' ||
    cs.visibility === 'hidden' ||
    Number.parseFloat(cs.opacity) === 0
  );
}

/**
 * Cosmetic filters hide bait nodes. Do not use `position:fixed` + `offsetParent`:
 * fixed elements have `offsetParent === null` in browsers without any blocker.
 */
export function detectCosmeticBait(): boolean {
  if (typeof document === 'undefined') return false;

  const host =
    document.body ??
    (() => {
      const b = document.createElement('body');
      document.documentElement.appendChild(b);
      return b;
    })();

  const wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText =
    'position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none;z-index:-1;';

  const el = document.createElement('div');
  el.innerHTML = '&nbsp;';
  el.className = BAIT_CLASS;
  el.setAttribute('data-ad-status', 'unblocked');
  el.style.cssText = 'display:block;width:1px;height:1px;';

  wrap.appendChild(el);
  host.appendChild(wrap);

  const cs = getComputedStyle(el);
  const blocked = isCosmeticBaitBlocked(el.offsetHeight, el.offsetWidth, cs);
  wrap.remove();
  return blocked;
}

export async function detectScriptProbe(timeoutMs = 3_500): Promise<boolean> {
  if (typeof document === 'undefined') return false;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${PROBE_SCRIPT_URL}?_=${Date.now()}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: controller.signal,
    });
    return !res.ok;
  } catch {
    return true;
  } finally {
    window.clearTimeout(timer);
  }
}

/** Block only when cosmetic bait or script probe fails (no offsetParent heuristic). */
export async function detectAdblockActive(): Promise<boolean> {
  if (detectCosmeticBait()) return true;
  if (await detectScriptProbe()) return true;
  return false;
}

export function applyAdblockDocumentState(blocked: boolean): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('pt-adblock', blocked);
  document.documentElement.style.overflow = blocked ? 'hidden' : '';
}
