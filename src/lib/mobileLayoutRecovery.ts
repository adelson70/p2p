const MOBILE_MQ = '(max-width: 767px)';

/** Clears stuck viewport / overflow styles after keyboard, camera, or app switch. */
export function recoverMobileLayout() {
  if (typeof window === 'undefined') return;
  if (!window.matchMedia(MOBILE_MQ).matches) return;

  const root = document.documentElement;
  const body = document.body;

  root.style.removeProperty('--app-vh');
  root.style.height = '';
  root.style.overflow = '';

  if (!root.classList.contains('pt-adblock')) {
    body.style.height = '';
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
    body.style.top = '';
  }

  const shell = document.querySelector<HTMLElement>('.app-shell');
  if (shell && !root.hasAttribute('data-immersive-shell')) {
    shell.style.height = '';
    shell.style.maxHeight = '';
    shell.style.overflow = '';
  }

  window.visualViewport?.height;
  void body.offsetHeight;
}

export function initMobileLayoutRecovery() {
  if (typeof window === 'undefined') return;

  const run = () => {
    recoverMobileLayout();
    requestAnimationFrame(recoverMobileLayout);
    window.setTimeout(recoverMobileLayout, 50);
    window.setTimeout(recoverMobileLayout, 250);
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const el = document.activeElement;
      if (
        el instanceof HTMLElement &&
        el.matches('input, textarea, select, [contenteditable="true"]')
      ) {
        el.blur();
      }
    }
    if (document.visibilityState === 'visible') run();
  });
  window.addEventListener('pageshow', run);
  window.addEventListener('focus', run);
  window.visualViewport?.addEventListener('resize', recoverMobileLayout);
}
