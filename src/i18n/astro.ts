import type { Locale } from './config';
import { locales } from './config';

/** Static paths for `src/pages/[locale]/…` routes. */
export function buildLocalePaths() {
  return locales.map((locale) => ({ params: { locale } }));
}

export function resolvePageLocale(param: string | undefined): Locale | null {
  if (!param) return null;
  return locales.includes(param as Locale) ? (param as Locale) : null;
}
