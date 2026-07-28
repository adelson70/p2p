import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/config';

/** Rewrites `href="/path"` in rendered HTML to include the locale prefix. */
export function localizeHtmlLinks(html: string, locale: Locale): string {
  return html.replace(/href="\/([^"#][^"]*)"/g, (_match, path: string) => {
    if (path.startsWith('_astro/')) return _match;
    return `href="${localePath(locale, `/${path}`)}"`;
  });
}

/** Rewrites markdown links like `](/transfer)` to include the active locale prefix. */
export function localizeMarkdownLinks(body: string, locale: Locale): string {
  return body.replace(/\]\(\/([^)\s#]+)(#[^)]*)?\)/g, (_match, path: string, hash?: string) => {
    const localized = localePath(locale, `/${path}`);
    return `](${localized}${hash ?? ''})`;
  });
}
