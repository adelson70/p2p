import { describe, expect, it } from 'vitest';
import {
  dictionaries,
  flattenDictionaryKeys,
  getDictionary,
  t,
} from '@/i18n';
import { locales } from '@/i18n/config';

describe('i18n', () => {
  const enKeys = flattenDictionaryKeys(dictionaries.en as Record<string, unknown>);

  it.each(locales)('getDictionary(%s) exposes all English keys', (locale) => {
    const dict = getDictionary(locale);
    const keys = flattenDictionaryKeys(dict as Record<string, unknown>);
    expect(keys).toEqual(enKeys);
  });

  it('getDictionary returns merged pack', () => {
    const dict = getDictionary('es');
    expect(dict.meta.siteName).toBeTruthy();
  });

  it('t resolves nested keys', () => {
    expect(t('en', 'meta.siteName')).toBe('Private Tools');
  });
});
