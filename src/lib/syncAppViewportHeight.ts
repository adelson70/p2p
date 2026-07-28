/** Keeps --app-vh in sync with the visible viewport (mobile keyboard / app switch). */
export function initAppViewportHeight() {
  const root = document.documentElement;

  const apply = () => {
    const vv = window.visualViewport;
    const height = vv ? vv.height : window.innerHeight;
    root.style.setProperty('--app-vh', `${Math.round(height)}px`);
  };

  const onVisible = () => {
    if (document.visibilityState !== 'visible') return;
    apply();
    requestAnimationFrame(apply);
  };

  const onHidden = () => {
    if (document.visibilityState !== 'hidden') return;
    const el = document.activeElement;
    if (
      el instanceof HTMLElement &&
      el.matches('input, textarea, select, [contenteditable="true"]')
    ) {
      el.blur();
    }
  };

  apply();

  window.visualViewport?.addEventListener('resize', apply);
  window.visualViewport?.addEventListener('scroll', apply);
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', apply);
  document.addEventListener('visibilitychange', () => {
    onHidden();
    onVisible();
  });
  window.addEventListener('pageshow', (event) => {
    apply();
    if (event.persisted) {
      requestAnimationFrame(apply);
    }
  });
}
