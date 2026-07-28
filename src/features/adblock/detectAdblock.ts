const BAIT_CLASS =
  'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links advertisement sponsored-content adsbox ad-placement';

const PROBE_SCRIPT_URL = '/ads.js';

export function isCosmeticBaitBlocked(
  height: number,
  width: number,
  offsetParent: Element | null,
  cs: Pick<CSSStyleDeclaration, 'display' | 'visibility' | 'opacity'>,
): boolean {
  return (
    height === 0 ||
    width === 0 ||
    !offsetParent ||
    cs.display === 'none' ||
    cs.visibility === 'hidden' ||
    Number.parseFloat(cs.opacity) === 0
  );
}

/** Cosmetic filters (AdGuard, uBlock, Brave Shields) hide bait elements. */
export function detectCosmeticBait(): boolean {
  if (typeof document === 'undefined') return false;

  const el = document.createElement('div');
  el.innerHTML = '&nbsp;';
  el.className = BAIT_CLASS;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('data-ad-status', 'unblocked');
  el.style.cssText =
    'position:fixed!important;left:-10000px!important;top:-10000px!important;width:1px!important;height:1px!important;z-index:-1!important;';

  document.documentElement.appendChild(el);
  const cs = getComputedStyle(el);
  const blocked = isCosmeticBaitBlocked(el.offsetHeight, el.offsetWidth, el.offsetParent, cs);
  el.remove();
  return blocked;
}

/** URL-filter lists block common ad script paths. */
export function detectScriptProbe(timeoutMs = 3_500): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (blocked: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      script.remove();
      resolve(blocked);
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `${PROBE_SCRIPT_URL}?_=${Date.now()}`;
    script.onload = () => finish(false);
    script.onerror = () => finish(true);

    const timer = window.setTimeout(() => finish(true), timeoutMs);
    document.head.appendChild(script);
  });
}

/** Aggressive: any probe that fires counts as blocked. */
export async function detectAdblockActive(): Promise<boolean> {
  if (detectCosmeticBait()) return true;
  if (await detectScriptProbe()) return true;
  return false;
}

export function applyAdblockDocumentState(blocked: boolean): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('pt-adblock', blocked);
  if (blocked) {
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = '';
  }
}
