import { useState, type ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { localeDefinitions, locales, localePath } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { clearAllUserData } from '@/services/db';
import {
  applyThemePreference,
  readPreferences,
  writePreferences,
  type ThemePreference,
} from '@/services/storage/preferences';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-5 text-center first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint ? <p className="mt-0.5 text-xs leading-relaxed text-muted">{hint}</p> : null}
      </div>
      <div className="flex w-full flex-col items-center">{children}</div>
    </div>
  );
}

function SegmentedButtons<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="inline-flex max-w-full gap-1 rounded-lg border border-border bg-surface-raised p-1"
      role="group"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`shrink-0 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors sm:px-4 ${
            value === opt.value
              ? 'bg-accent-muted font-medium text-accent shadow-sm'
              : 'text-muted hover:bg-white/5 hover:text-foreground'
          }`}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsPanel({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [theme, setTheme] = useState<ThemePreference>(
    () => readPreferences().theme ?? 'system',
  );
  const [message, setMessage] = useState('');

  const onTheme = (value: ThemePreference) => {
    setTheme(value);
    writePreferences({ theme: value });
    applyThemePreference(value);
  };

  const onClear = async () => {
    if (!window.confirm(dict.settings.clearConfirm)) return;
    await clearAllUserData();
    localStorage.removeItem('pt_prefs');
    setMessage(dict.settings.cleared);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader title={dict.settings.title} subtitle={dict.settings.subtitle} />

      <Card className="divide-y divide-border p-0 px-5 sm:px-6">
        <SettingRow label={dict.settings.language} hint={dict.settings.languagePicker}>
          <div
            className="grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-5"
            role="list"
          >
            {locales.map((loc) => {
              const def = localeDefinitions[loc];
              const active = loc === locale;
              return (
                <a
                  key={loc}
                  href={localePath(loc, '/settings')}
                  role="listitem"
                  className={`rounded-lg border px-3 py-2.5 text-center text-sm transition-colors ${
                    active
                      ? 'border-accent/40 bg-accent-muted font-medium text-accent'
                      : 'border-border text-muted hover:bg-white/5 hover:text-foreground'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="block font-medium">{def.nativeName}</span>
                  <span className="text-[10px] uppercase opacity-70">{def.code}</span>
                </a>
              );
            })}
          </div>
        </SettingRow>

        <SettingRow label={dict.settings.theme}>
          <SegmentedButtons
            value={theme}
            options={[
              { value: 'system', label: dict.settings.themeSystem },
              { value: 'dark', label: dict.settings.themeDark },
              { value: 'light', label: dict.settings.themeLight },
            ]}
            onChange={onTheme}
          />
        </SettingRow>
      </Card>

      <Card className="mt-6 border-red-500/25 bg-red-950/10 p-5 sm:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium text-foreground">{dict.settings.dangerZone}</p>
          <div className="flex w-full flex-col items-center gap-3">
            <Button variant="danger" onClick={onClear}>
              {dict.settings.clearData}
            </Button>
            {message ? (
              <p className="text-sm text-muted" role="status">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
