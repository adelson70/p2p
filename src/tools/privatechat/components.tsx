import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { localeToIntlTag } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { Button } from '@/components/Button';
import { Progress } from '@/components/Progress';
import type { ChatMessageItem } from '@/tools/privatechat/ChatSession';
import { isImageMime, isVideoMime } from '@/tools/privatechat/ChatSession';
import { EmojiPicker, insertTextAtCursor } from '@/tools/privatechat/EmojiPicker';
import { NavIconInfo, NavIconSend } from '@/components/nav/NavIcons';

function TypingIndicator({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="flex justify-start">
      <div
        className="flex items-center gap-1 rounded-lg rounded-bl-none border border-white/5 bg-[#202c33] px-4 py-3 shadow-sm"
        role="status"
        aria-live="polite"
        aria-label={dict.privatechat.peerTyping}
      >
        <span className="chat-typing-dot" aria-hidden />
        <span className="chat-typing-dot" aria-hidden />
        <span className="chat-typing-dot" aria-hidden />
      </div>
    </div>
  );
}

export function MessageList({
  locale,
  messages,
  peerTyping,
  className = '',
}: {
  locale: Locale;
  messages: ChatMessageItem[];
  peerTyping: boolean;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, peerTyping]);

  return (
    <div
      ref={listRef}
      className={`min-h-0 overflow-y-auto overscroll-y-contain bg-[#0b141a] px-3 py-3 md:px-6 ${className}`}
    >
      {messages.length === 0 && !peerTyping ? (
        <p className="py-12 text-center text-sm text-[#8696a0]">{dict.privatechat.emptyThread}</p>
      ) : (
        <div className="flex min-h-full flex-col">
          <div className="mt-auto flex w-full flex-col gap-2">
            {messages.length === 0 && peerTyping ? (
              <div className="flex min-h-[40vh] flex-col justify-end">
                <TypingIndicator locale={locale} />
              </div>
            ) : null}
            {messages.map((m) => {
              if (m.kind === 'text') {
                const out = m.direction === 'out';
                return (
                  <div key={m.id} className={`flex ${out ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[65%] rounded-lg px-3 py-2 text-sm shadow-sm sm:max-w-[min(65%,36rem)] ${
                        out
                          ? 'rounded-br-none bg-[#005c4b] text-[#e9edef]'
                          : 'rounded-bl-none border border-white/5 bg-[#202c33] text-[#e9edef]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.body}</p>
                      <p
                        className={`mt-1 text-end text-[10px] ${out ? 'text-[#ffffff99]' : 'text-[#ffffff66]'}`}
                      >
                        {new Date(m.sentAt).toLocaleTimeString(localeToIntlTag(locale), {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              }
              return <FileTransferBubble key={m.id} locale={locale} item={m} />;
            })}
            {peerTyping ? <TypingIndicator locale={locale} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}

function FileTransferBubble({ locale, item }: { locale: Locale; item: Extract<ChatMessageItem, { kind: 'file' }> }) {
  const dict = getDictionary(locale);
  const out = item.direction === 'out';
  const mime = item.mimeType ?? item.file?.type ?? '';
  const mediaUrl = item.objectUrl;
  const showImage = mediaUrl && isImageMime(mime);
  const showVideo = mediaUrl && isVideoMime(mime);
  const isMedia = showImage || showVideo;

  return (
    <div className={`flex ${out ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[65%] overflow-hidden rounded-lg text-sm shadow-sm sm:max-w-[min(65%,22rem)] ${
          isMedia ? 'bg-[#1f2c34] p-1' : out ? 'bg-[#005c4b] px-3 py-2 text-[#e9edef]' : 'bg-[#202c33] px-3 py-2 text-[#e9edef]'
        }`}
      >
        {showImage ? (
          <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={mediaUrl}
              alt={item.name}
              className="max-h-64 w-full rounded-md object-cover"
            />
          </a>
        ) : null}
        {showVideo ? (
          <video
            src={mediaUrl}
            controls
            playsInline
            className="max-h-64 w-full rounded-md bg-black"
            preload="metadata"
          />
        ) : null}
        {!isMedia ? <p className="font-medium">{item.name}</p> : null}
        {item.progress ? (
          <div className={isMedia ? 'p-2' : ''}>
            <Progress value={item.progress.sent} max={item.progress.total} label={item.name} />
          </div>
        ) : null}
        {isMedia && item.status === 'done' ? (
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-[10px] text-[#8696a0]">
            <span className="truncate">{item.name}</span>
            {mediaUrl ? (
              <a
                href={mediaUrl}
                download={item.name}
                className="shrink-0 text-[#53bdeb] hover:underline"
              >
                {dict.privatechat.downloadFile}
              </a>
            ) : null}
          </div>
        ) : null}
        {!isMedia && item.status === 'done' && item.objectUrl ? (
          <a
            href={item.objectUrl}
            download={item.name}
            className="mt-1 inline-block text-xs text-[#53bdeb] hover:underline"
          >
            {dict.privatechat.downloadFile}
          </a>
        ) : null}
        {item.status === 'error' ? (
          <p className="mt-1 px-2 pb-1 text-xs text-red-400">{dict.privatechat.fileError}</p>
        ) : null}
        {!item.progress && item.status !== 'done' && item.status !== 'error' ? (
          <p className={`text-xs text-[#8696a0] ${isMedia ? 'px-2 pb-1' : ''}`}>
            {dict.privatechat.fileSending}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function ChatComposer({
  locale,
  disabled,
  onSend,
  onAttach,
  onTyping,
}: {
  locale: Locale;
  disabled?: boolean;
  onSend: (text: string) => void;
  onAttach: (files: File[]) => void;
  onTyping?: () => void;
}) {
  const dict = getDictionary(locale);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const submit = () => {
    const el = inputRef.current;
    if (!el) return;
    const text = el.value;
    if (!text.trim()) return;
    onSend(text);
    el.value = '';
    el.style.height = 'auto';
  };

  return (
    <div className="shrink-0 border-t border-border bg-[#202c33] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
      <div className="flex w-full items-end gap-2">
        <button
          type="button"
          disabled={disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#8696a0] hover:bg-white/5 hover:text-[#e9edef] disabled:opacity-50"
          aria-label={dict.privatechat.attach}
          onClick={() => fileRef.current?.click()}
        >
          <AttachIcon />
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*,*/*"
          className="hidden"
          onChange={(e) => {
            const list = Array.from(e.target.files ?? []);
            if (list.length) onAttach(list);
            e.target.value = '';
          }}
        />
        <div className="relative shrink-0">
          <button
            ref={emojiBtnRef}
            type="button"
            disabled={disabled}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-[#8696a0] hover:bg-white/5 disabled:opacity-50"
            aria-label={dict.privatechat.emoji}
            aria-expanded={emojiOpen}
            onClick={() => setEmojiOpen((v) => !v)}
          >
            <span aria-hidden>😊</span>
          </button>
          <EmojiPicker
            locale={locale}
            open={emojiOpen}
            anchorRef={emojiBtnRef}
            onClose={() => setEmojiOpen(false)}
            onPick={(emoji) => {
              const el = inputRef.current;
              if (el) {
                insertTextAtCursor(el, emoji);
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
                onTyping?.();
              }
              setEmojiOpen(false);
              el?.focus();
            }}
          />
        </div>
        <textarea
          ref={inputRef}
          disabled={disabled}
          rows={1}
          className="max-h-32 min-h-10 flex-1 resize-none rounded-lg border-0 bg-[#2a3942] px-4 py-2.5 text-sm text-[#e9edef] placeholder:text-[#8696a0] focus:outline-none focus:ring-1 focus:ring-accent/50"
          placeholder={dict.privatechat.messagePlaceholder}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
            onTyping?.();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <Button
          size="sm"
          disabled={disabled}
          className="h-10 w-10 shrink-0 rounded-full p-0 sm:h-10 sm:w-auto sm:px-5"
          aria-label={dict.privatechat.send}
          onClick={submit}
        >
          <span className="sm:hidden">
            <NavIconSend />
          </span>
          <span className="hidden sm:inline">{dict.privatechat.send}</span>
        </Button>
      </div>
    </div>
  );
}

function AttachIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChatThreadHeader({
  locale,
  roomCode,
  statusText,
  connected,
  onLeave,
}: {
  locale: Locale;
  roomCode?: string;
  statusText: string;
  connected: boolean;
  onLeave: () => void;
}) {
  const dict = getDictionary(locale);
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-[#202c33] px-4 py-3 md:px-6">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-medium text-[#e9edef]">{dict.privatechat.title}</h2>
        <p className="truncate text-xs text-[#8696a0]">
          {roomCode ? (
            <>
              <span className="font-mono tracking-wider">{roomCode}</span>
              <span className="mx-1.5">·</span>
            </>
          ) : null}
          {statusText}
          {connected ? (
            <>
              <span className="mx-1.5">·</span>
              <span className="text-[#53bdeb]">{dict.privatechat.encryptionBadge}</span>
            </>
          ) : null}
        </p>
      </div>
      <details className="relative shrink-0 text-[#8696a0]">
        <summary
          className="flex cursor-pointer list-none items-center justify-center rounded-lg p-2 hover:bg-white/5 sm:px-2 sm:py-1 [&::-webkit-details-marker]:hidden"
          aria-label={dict.privatechat.privacyShort}
        >
          <span className="hidden text-xs sm:inline">{dict.privatechat.privacyShort}</span>
          <NavIconInfo className="sm:hidden" />
        </summary>
        <p className="absolute right-0 top-full z-10 mt-1 max-w-[min(100vw-2rem,20rem)] rounded-lg border border-border bg-surface p-3 text-[11px] leading-relaxed shadow-lg">
          {dict.privatechat.encryptionHint}
        </p>
      </details>
      <Button size="sm" variant="danger" className="shrink-0 max-sm:px-2.5" onClick={onLeave}>
        {dict.privatechat.leave}
      </Button>
    </header>
  );
}
