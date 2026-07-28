import type { Locale } from '@/i18n/config';

const STORAGE_KEY = 'pt_prefs';

export type ThemePreference = 'system' | 'dark' | 'light';

export interface UserPreferences {
  locale?: Locale;
  theme?: ThemePreference;
}

export function readPreferences(): UserPreferences {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UserPreferences;
  } catch {
    return {};
  }
}

export function writePreferences(prefs: UserPreferences): void {
  if (typeof localStorage === 'undefined') return;
  const merged = { ...readPreferences(), ...prefs };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function applyThemePreference(theme: ThemePreference): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

export function initThemeFromStorage(): void {
  const { theme = 'system' } = readPreferences();
  applyThemePreference(theme);
}
