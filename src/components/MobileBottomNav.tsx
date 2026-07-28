import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import {
  NavIconCommunication,
  NavIconSettings,
  NavIconTools,
  NavIconTransfer,
} from '@/components/nav/NavIcons';

const mobileNavItems = [
  { key: 'tools' as const, path: '/tools', Icon: NavIconTools },
  { key: 'transfer' as const, path: '/transfer', Icon: NavIconTransfer },
  { key: 'communication' as const, path: '/communication', Icon: NavIconCommunication },
  { key: 'settings' as const, path: '/settings', Icon: NavIconSettings },
] as const;

export function MobileBottomNav({
  locale,
  currentPath = '',
}: {
  locale: Locale;
  currentPath?: string;
}) {
  const dict = getDictionary(locale);

  return (
    <nav
      className="app-mobile-bottom-nav z-30 shrink-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label={dict.nav.tools}
    >
      <div className="grid h-16 grid-cols-4">
        {mobileNavItems.map((item) => {
          const href = localePath(locale, item.path);
          const active = currentPath.startsWith(item.path);
          const { Icon } = item;
          return (
            <a
              key={item.path}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                active ? 'text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="max-w-full truncate text-[10px] font-medium leading-tight">
                {dict.nav[item.key]}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
