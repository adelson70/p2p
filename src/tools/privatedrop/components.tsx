import { useCallback, useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { getQrScannerVideoStream } from '@/features/connection/pairingCamera';

interface DropZoneProps {
  label: string;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function DropZone({ label, onFiles, disabled }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const list = Array.from(e.dataTransfer.files);
      if (list.length) onFiles(list);
    },
    [disabled, onFiles],
  );

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`rounded-xl border border-dashed border-border bg-surface-raised p-10 text-center ${
        disabled ? 'opacity-50' : 'cursor-pointer hover:border-accent/40'
      }`}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <p className="text-sm text-muted">{label}</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          if (list.length) onFiles(list);
        }}
      />
    </div>
  );
}

interface FileQueueProps {
  locale: Locale;
  files: File[];
  onRemove: (index: number) => void;
}

export function FileQueue({ locale, files, onRemove }: FileQueueProps) {
  const dict = getDictionary(locale);
  if (files.length === 0) return null;
  return (
    <Card className="space-y-2">
      <p className="text-sm font-medium">{dict.privatedrop.queue}</p>
      <ul className="space-y-1 text-sm">
        {files.map((f, i) => (
          <li key={`${f.name}-${i}`} className="flex justify-between gap-2">
            <span className="truncate">{f.name}</span>
            <button type="button" className="text-muted hover:text-foreground" onClick={() => onRemove(i)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h3l2-2h6l2 2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SignalingCodeField({
  locale,
  onApply,
}: {
  locale: Locale;
  onApply: (text: string) => void;
}) {
  const dict = getDictionary(locale);
  const [value, setValue] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);

  const apply = () => {
    const trimmed = value.trim();
    if (trimmed) onApply(trimmed);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm placeholder:text-muted/70"
        placeholder={dict.privatedrop.pastePlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && apply()}
        autoComplete="off"
        spellCheck={false}
      />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={apply} disabled={!value.trim()}>
          {dict.privatedrop.applyPaste}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setScannerOpen(true)}
          className="gap-2"
          aria-label={dict.privatedrop.scanCamera}
        >
          <CameraIcon />
          {dict.privatedrop.scanCamera}
        </Button>
      </div>
      {scannerOpen ? (
        <QrCameraScanner
          locale={locale}
          onClose={() => setScannerOpen(false)}
          onResult={(text) => {
            setValue(text);
            onApply(text);
            setScannerOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

export function ShareSignalingBlock({
  locale,
  roomCode,
  copyLabel,
  qrDataUrl,
  qrVisible,
  qrLoading,
  onToggleQr,
  onCopy,
  copied,
}: {
  locale: Locale;
  roomCode?: string;
  copyLabel: string;
  qrDataUrl?: string;
  qrVisible: boolean;
  qrLoading?: boolean;
  onToggleQr: () => void | Promise<void>;
  onCopy: () => void;
  copied: boolean;
}) {
  const dict = getDictionary(locale);
  const [busy, setBusy] = useState(false);

  const handleToggleQr = async () => {
    if (busy || qrLoading) return;
    setBusy(true);
    try {
      await onToggleQr();
    } finally {
      setBusy(false);
    }
  };

  const showQrBlock = qrVisible && (qrDataUrl || busy || qrLoading);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface-raised/50 p-4">
      {roomCode ? (
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted">{dict.privatedrop.roomCode}</p>
          <p className="font-mono text-xl tracking-[0.35em] text-foreground">{roomCode}</p>
        </div>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2">
        <Button size="sm" variant="secondary" onClick={onCopy}>
          {copied ? dict.privatedrop.copied : copyLabel}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => void handleToggleQr()} disabled={busy || qrLoading}>
          {qrVisible ? dict.privatedrop.hideQr : dict.privatedrop.showQr}
        </Button>
      </div>
      {showQrBlock ? (
        <div className="flex justify-center pt-1">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt=""
              className="max-w-full rounded-lg border border-border bg-white p-2"
              width={280}
              height={280}
            />
          ) : (
            <p className="py-8 text-sm text-muted">{dict.privatedrop.showQr}…</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function PairingStep({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs text-accent">
          {step}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ConnectionBadge({
  label,
  statusText,
  connected,
}: {
  label: string;
  statusText: string;
  connected: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
        connected
          ? 'border-accent/40 bg-accent/10 text-accent'
          : 'border-border bg-surface-raised text-muted'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-accent' : 'bg-muted'}`}
        aria-hidden
      />
      <span className="text-muted">{label}</span>
      <span className={connected ? 'text-accent' : 'text-foreground'}>{statusText}</span>
    </div>
  );
}

export function QrCameraScanner({
  locale,
  onClose,
  onResult,
}: {
  locale: Locale;
  onClose: () => void;
  onResult: (text: string) => void;
}) {
  const dict = getDictionary(locale);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onResultRef = useRef(onResult);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    let stream: MediaStream | undefined;
    let raf = 0;
    let stopped = false;

    const run = async () => {
      if (!('BarcodeDetector' in window)) {
        setError(dict.privatedrop.scanNotSupported);
        return;
      }
      try {
        stream = await getQrScannerVideoStream();
      } catch {
        setError(dict.privatedrop.cameraPermission);
        return;
      }
      const video = videoRef.current;
      if (!video || stopped) return;
      video.srcObject = stream;
      await video.play();

      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const tick = async () => {
        if (stopped || !videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          const value = codes[0]?.rawValue;
          if (value) {
            onResultRef.current(value);
            return;
          }
        } catch {
          // frame skip
        }
        raf = requestAnimationFrame(() => void tick());
      };
      void tick();
    };

    void run();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [dict.privatedrop.cameraPermission, dict.privatedrop.scanNotSupported]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal
      aria-label={dict.privatedrop.scanCamera}
    >
      <div className="w-full max-w-sm space-y-3 rounded-xl border border-border bg-surface p-4">
        <p className="text-center text-sm text-muted">{dict.privatedrop.scanCameraHint}</p>
        {error ? (
          <p className="text-center text-sm text-red-400">{error}</p>
        ) : (
          <video
            ref={videoRef}
            className="aspect-square w-full rounded-lg bg-black object-contain"
            muted
            playsInline
            autoPlay
          />
        )}
        <Button size="sm" variant="secondary" className="w-full" onClick={onClose}>
          {dict.privatedrop.closeScanner}
        </Button>
      </div>
    </div>
  );
}
