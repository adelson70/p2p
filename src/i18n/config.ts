export type Locale = 'en' | 'pt' | 'es' | 'fr' | 'zh';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'pt', 'es', 'fr', 'zh'];

export type LocaleDirection = 'ltr' | 'rtl';

export interface LocaleDefinition {
  /** BCP 47 tag for `<html lang>` and `Intl` */
  bcp47: string;
  /** Short code shown in compact UI */
  code: string;
  /** Name in English (for screen readers / admin) */
  name: string;
  /** Name in the locale itself */
  nativeName: string;
  direction: LocaleDirection;
}

export const localeDefinitions: Record<Locale, LocaleDefinition> = {
  en: { bcp47: 'en', code: 'EN', name: 'English', nativeName: 'English', direction: 'ltr' },
  pt: { bcp47: 'pt-BR', code: 'PT', name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
  es: { bcp47: 'es', code: 'ES', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  fr: { bcp47: 'fr', code: 'FR', name: 'French', nativeName: 'Français', direction: 'ltr' },
  zh: { bcp47: 'zh-Hans', code: 'ZH', name: 'Chinese', nativeName: '简体中文', direction: 'ltr' },
};

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

export function localePath(locale: Locale, path: string): string {
  const loc = isLocale(locale) ? locale : defaultLocale;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${loc}${normalized === '/' ? '' : normalized}`;
}

export function alternateLocales(locale: Locale): Locale[] {
  return locales.filter((l) => l !== locale);
}

/** Tag for `Date.prototype.toLocaleString` and similar APIs. */
export function localeToIntlTag(locale: Locale): string {
  return localeDefinitions[locale].bcp47;
}

export function localeDirection(locale: Locale): LocaleDirection {
  return localeDefinitions[locale].direction;
}
