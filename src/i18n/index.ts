import type { Locale } from './config';
import { defaultLocale } from './config';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';
import fr from './fr.json';
import zh from './zh.json';

const dictionaries = { en, pt, es, fr, zh } as const;

export type Dictionary = typeof en;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Deep-merge `override` onto `base` (override wins). Used for fallback to English. */
export function deepMergeDictionary<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): T {
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override)) {
    const bv = base[key];
    const ov = override[key];
    if (isPlainObject(bv) && isPlainObject(ov)) {
      out[key] = deepMergeDictionary(bv, ov);
    } else if (ov !== undefined) {
      out[key] = ov;
    }
  }
  return out as T;
}

export function getDictionary(locale: Locale): Dictionary {
  const pack = dictionaries[locale] ?? dictionaries[defaultLocale];
  if (locale === defaultLocale) return pack;
  return deepMergeDictionary(dictionaries[defaultLocale], pack as Record<string, unknown>);
}

export function t(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const dict = getDictionary(locale);
  const parts = key.split('.');
  let value: unknown = dict;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  if (typeof value !== 'string') return key;
  if (!vars) return value;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    value,
  );
}

export function createTranslator(locale: Locale) {
  return (key: string, vars?: Record<string, string | number>) => t(locale, key, vars);
}

/** Flatten nested keys for parity checks (`meta.siteName`, …). */
export function flattenDictionaryKeys(
  obj: Record<string, unknown>,
  prefix = '',
): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (isPlainObject(v)) {
      keys.push(...flattenDictionaryKeys(v, path));
    } else {
      keys.push(path);
    }
  }
  return keys.sort();
}

export { dictionaries };
