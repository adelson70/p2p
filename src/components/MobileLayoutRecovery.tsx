import { useEffect } from 'react';
import { initMobileLayoutRecovery, recoverMobileLayout } from '@/lib/mobileLayoutRecovery';

/** Client guard: re-sync layout when returning to the tab on mobile. */
export function MobileLayoutRecovery() {
  useEffect(() => {
    initMobileLayoutRecovery();
    recoverMobileLayout();
    return () => {};
  }, []);

  return null;
}
