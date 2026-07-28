import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { tools, type ToolCategory } from '@/tools/registry';
import { PageHeader } from '@/components/PageHeader';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/Button';

export function ToolsDirectory({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [filter, setFilter] = useState<ToolCategory | 'all'>('all');
  const filtered = useMemo(
    () => (filter === 'all' ? tools : tools.filter((t) => t.category === filter)),
    [filter],
  );

  const filters: { id: ToolCategory | 'all'; label: string }[] = [
    { id: 'all', label: dict.tools.filterAll },
    { id: 'transfer', label: dict.categories.transfer },
    { id: 'communication', label: dict.categories.communication },
    { id: 'collaboration', label: dict.categories.collaboration },
  ];

  return (
    <div className="w-full">
      <PageHeader title={dict.tools.title} />
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <Button
            key={f.id}
            variant={filter === f.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <ToolCard key={tool.id} locale={locale} tool={tool} />
        ))}
      </div>
    </div>
  );
}
