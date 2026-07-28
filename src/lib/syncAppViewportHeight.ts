import { initMobileLayoutRecovery, recoverMobileLayout } from '@/lib/mobileLayoutRecovery';

export function readAppViewportHeight(): number {
  return window.innerHeight;
}

export function refreshAppViewportHeight() {
  recoverMobileLayout();
}

export function initAppViewportHeight() {
  initMobileLayoutRecovery();
}
