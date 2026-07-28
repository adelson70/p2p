import type { SignalingPacket } from '@/features/connection/signalingManual';
import { QrPayloadTooLargeError } from '@/features/connection/pairingQr';

type TogglePairingQrParams = {
  visible: boolean;
  setVisible: (v: boolean) => void;
  setDataUrl: (url: string) => void;
  getPacket: () => SignalingPacket | null | undefined;
  loadQr: (packet: SignalingPacket) => Promise<string>;
  onQrTooLarge: () => void;
};

/** Generate QR before showing; close when already visible. Skips open if packet missing. */
export async function runTogglePairingQr(params: TogglePairingQrParams): Promise<void> {
  if (params.visible) {
    params.setVisible(false);
    return;
  }
  const packet = params.getPacket();
  if (!packet) return;
  try {
    const url = await params.loadQr(packet);
    params.setDataUrl(url);
    params.setVisible(true);
  } catch (e) {
    if (e instanceof QrPayloadTooLargeError) {
      params.onQrTooLarge();
      return;
    }
    throw e;
  }
}
