import { chatConnectionManager } from '@/tools/privatechat/chatConnectionManager';
import { callConnectionManager } from '@/tools/privatecall/callConnectionManager';
import { whiteboardConnectionManager } from '@/tools/whiteboard/whiteboardConnectionManager';
import { connectionManager } from '@/features/connection/connectionManager';

let installed = false;

export function ensureConnectionLifecycle(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    chatConnectionManager.nudgeRecovery();
    callConnectionManager.nudgeRecovery();
    whiteboardConnectionManager.nudgeRecovery();
    connectionManager.nudgeRecovery();
  });
}
