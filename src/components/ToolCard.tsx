import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import type { ToolDefinition } from '@/tools/registry';
import { Badge } from './Badge';
import { Card } from './Card';

interface ToolCardProps {
  locale: Locale;
  tool: ToolDefinition;
}

export function ToolCard({ locale, tool }: ToolCardProps) {
  const dict = getDictionary(locale);
  const entry = dict.toolEntries[tool.i18nKey as keyof typeof dict.toolEntries];
  const href =
    tool.status === 'live' && tool.path
      ? localePath(locale, `/${tool.path}`)
      : undefined;

  const inner = (
  <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-foreground">{entry.name}</h3>
        <Badge
          className={
            tool.status === 'live'
              ? 'border-accent/30 bg-accent-muted text-accent'
              : ''
          }
        >
          {tool.status === 'live' ? dict.tools.live : dict.tools.soon}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted">{entry.description}</p>
    </>
  );

  if (href) {
    return (
      <a href={href} className="block transition-opacity hover:opacity-90">
        <Card className="h-full">{inner}</Card>
      </a>
    );
  }

  return <Card className="h-full opacity-80">{inner}</Card>;
}
