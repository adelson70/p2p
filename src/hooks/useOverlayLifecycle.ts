import { useEffect } from 'react';
import { recoverMobileLayout } from '@/lib/mobileLayoutRecovery';

const ATTR = 'data-pt-overlay';

/** Full-screen overlays (QR, camera): release shell locks and refresh viewport on close. */
export function useOverlayLifecycle(active = true) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.setAttribute(ATTR, '');
    recoverMobileLayout();
    return () => {
      root.removeAttribute(ATTR);
      recoverMobileLayout();
      requestAnimationFrame(recoverMobileLayout);
      window.setTimeout(recoverMobileLayout, 50);
      window.setTimeout(recoverMobileLayout, 200);
    };
  }, [active]);
}
