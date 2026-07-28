import LZString from 'lz-string';
import type { SignalingPacket } from './signalingManual';
import { parseSignaling, serializeSignaling } from './signalingManual';
import { qrShrinkVariants } from './signalingForQr';

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

export class QrPayloadTooLargeError extends Error {
  constructor() {
    super('QR payload too large');
    this.name = 'QrPayloadTooLargeError';
  }
}

function isQrCapacityError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /too big/i.test(message);
}

const QR_RENDER_OPTIONS = {
  margin: 2,
  width: 768,
  errorCorrectionLevel: 'M' as const,
  color: { dark: '#000000', light: '#ffffff' },
} as const;

export async function renderQrDataUrl(text: string): Promise<string> {
  const QRCode = await import('qrcode');
  try {
    return await QRCode.toDataURL(text, QR_RENDER_OPTIONS);
  } catch (err) {
    if (isQrCapacityError(err)) throw new QrPayloadTooLargeError();
    throw err;
  }
}

/** Renders a QR for signaling, shrinking ICE when the full payload does not fit. */
export async function renderSignalingQrDataUrl(packet: SignalingPacket): Promise<string> {
  const QRCode = await import('qrcode');
  const payloads = [
    encodeSignalingForQr(packet),
    ...qrShrinkVariants(packet).map((variant) => encodeSignalingForQr(variant)),
  ];
  const unique = [...new Set(payloads)];

  let lastCapacityError: QrPayloadTooLargeError | undefined;
  for (const text of unique) {
    try {
      return await QRCode.toDataURL(text, QR_RENDER_OPTIONS);
    } catch (err) {
      if (isQrCapacityError(err)) {
        lastCapacityError = new QrPayloadTooLargeError();
        continue;
      }
      throw err;
    }
  }
  throw lastCapacityError ?? new QrPayloadTooLargeError();
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
