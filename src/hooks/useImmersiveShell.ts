import { useEffect } from 'react';

const ATTR = 'data-immersive-shell';

export function useImmersiveShell(active: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    if (active) {
      root.setAttribute(ATTR, 'true');
    } else {
      root.removeAttribute(ATTR);
    }
    return () => {
      root.removeAttribute(ATTR);
    };
  }, [active]);
}
