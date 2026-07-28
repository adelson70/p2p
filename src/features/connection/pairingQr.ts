import LZString from 'lz-string';
import type { SignalingPacket } from './signalingManual';
import { parseSignaling, serializeSignaling } from './signalingManual';

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = LZString;

export const QR_PREFIX = 'pt1:';

export function encodeSignalingForQr(packet: SignalingPacket): string {
  return QR_PREFIX + compressToEncodedURIComponent(serializeSignaling(packet));
}

/** Accept JSON, pt1:… QR payload, or raw lz-string from a scan. */
export function parseSignalingInput(raw: string): SignalingPacket {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('Nothing to paste. Copy the full invite or response first.');
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith(QR_PREFIX)) {
    const decompressed = decompressFromEncodedURIComponent(trimmed.slice(QR_PREFIX.length));
    if (!decompressed) {
      throw new Error('Invalid QR or compressed invite. Copy again from the other device.');
    }
    return parseSignaling(decompressed);
  }

  if (trimmed.startsWith('{')) {
    return parseSignaling(trimmed);
  }

  const decompressed = decompressFromEncodedURIComponent(trimmed);
  if (decompressed?.trim().startsWith('{')) {
    return parseSignaling(decompressed.trim());
  }

  throw new Error(
    'Unrecognized format. Use “Copy invite” / “Copy response”, or paste the full text (starts with { or pt1:).',
  );
}

export function decodeSignalingFromQr(payload: string): SignalingPacket {
  return parseSignalingInput(payload);
}

export async function renderQrDataUrl(text: string): Promise<string> {
  const QRCode = await import('qrcode');
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 280,
    color: { dark: '#fafafa', light: '#09090b' },
  });
}

export async function scanQrFromImageFile(file: File): Promise<string> {
  if ('BarcodeDetector' in window) {
    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    const bitmap = await createImageBitmap(file);
    const codes = await detector.detect(bitmap);
    bitmap.close();
    const value = codes[0]?.rawValue;
    if (value) return value;
  }
  throw new Error('QR scan not supported');
}
