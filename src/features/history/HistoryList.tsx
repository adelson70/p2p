import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { localeToIntlTag } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { listSessions } from '@/services/db';
import type { SessionRecord } from '@/services/db/schema';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';

const TOOL_LABELS: Record<string, Record<Locale, string>> = {
  privatedrop: { en: 'PrivateDrop', pt: 'PrivateDrop', es: 'PrivateDrop', fr: 'PrivateDrop', zh: 'PrivateDrop' },
  privatechat: { en: 'PrivateChat', pt: 'PrivateChat', es: 'PrivateChat', fr: 'PrivateChat', zh: 'PrivateChat' },
  privatecall: { en: 'PrivateCall', pt: 'PrivateCall', es: 'PrivateCall', fr: 'PrivateCall', zh: 'PrivateCall' },
  whiteboard: { en: 'Whiteboard', pt: 'Quadro branco', es: 'Pizarra', fr: 'Tableau blanc', zh: '白板' },
};

function toolLabel(toolId: string, locale: Locale): string {
  return TOOL_LABELS[toolId]?.[locale] ?? TOOL_LABELS[toolId]?.en ?? toolId;
}

export function HistoryList({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSessions()
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full">
      <PageHeader title={dict.history.title} subtitle={dict.history.subtitle} />
      {loading ? (
        <p className="text-center text-sm text-muted">…</p>
      ) : sessions.length === 0 ? (
        <Card className="text-center">
          <p className="text-muted">{dict.history.empty}</p>
          <p className="mt-2 text-xs text-muted">{dict.history.clearHint}</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li key={s.id}>
              <Card className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{toolLabel(s.toolId, locale)}</p>
                  <p className="text-xs text-muted">
                    {dict.history.started}: {new Date(s.startedAt).toLocaleString(localeToIntlTag(locale))}
                  </p>
                </div>
                <div className="text-right text-xs text-muted">
                  {s.roomCode ? <p>{s.roomCode}</p> : null}
                  <p>
                    {dict.history.status}: {s.status}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
