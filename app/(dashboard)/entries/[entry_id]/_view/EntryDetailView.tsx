'use client';

// app/(dashboard)/entries/[entry_id]/_view/EntryDetailView.tsx
// Composition view: combines entries + insights features.
// Lives in app/ because it crosses feature boundaries - that's the correct place.

import { use, useState } from 'react';
import { useEntry } from '@/features/entries';
import { getSeedInsight } from '@/features/insights';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils/utils';
import { formatDatetimeMn } from '@/shared/lib/utils/date';
import { useThoughtContext } from '@/shared/providers/tier.provider';
import {
  ArrowLeft, Loader2, AlertCircle, Lock, FileText, Eye, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import type { SeedInsight } from '@/types';

const INSIGHT_CARDS = [
  { key: 'mirror'  as const, label: 'Mirror',  sub: 'Чиний хэлснийг тусгавал', dot: 'bg-insight-mirror',  bg: 'bg-insight-mirror/8'  },
  { key: 'reframe' as const, label: 'Reframe', sub: 'Өнцгийг эргүүлэвэл',      dot: 'bg-insight-reframe', bg: 'bg-insight-reframe/8' },
  { key: 'relief'  as const, label: 'Relief',  sub: 'Ачааг хөнгөлөвөл',        dot: 'bg-insight-relief',  bg: 'bg-insight-relief/8'  },
  { key: 'summary' as const, label: 'Summary', sub: 'Хураангуй',                dot: 'bg-insight-summary', bg: 'bg-insight-summary/8' },
] as const;

function Section({ label, content }: { label: string; content: string | null }) {
  if (!content) return null;
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
      <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 rounded-2xl p-4">{content}</p>
    </div>
  );
}

export function EntryDetailView({ params }: { params: Promise<{ entry_id: string }> }) {
  const { entry_id } = use(params);
  const { token } = useThoughtContext();
  const { entry, loading, error } = useEntry(token, entry_id);

  const [insight, setInsight] = useState<(SeedInsight & { summary?: string }) | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const loadInsight = async () => {
    if (!token) return;
    setInsightLoading(true);
    setInsightError(null);
    try {
      const data = await getSeedInsight(token, entry_id);
      setInsight(data);
    } catch (err) {
      setInsightError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setInsightLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      <Link href="/entries">
        <Button variant="ghost" size="sm" className="rounded-xl gap-2 -ml-2 text-muted-foreground">
          <ArrowLeft size={14} /> Бичлэгүүд
        </Button>
      </Link>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={16} />{error}
        </div>
      )}

      {entry && (
        <>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-muted px-2.5 py-1 rounded-full text-muted-foreground">#{entry.entry_index}</span>
              {entry.is_encrypted && (
                <span className="flex items-center gap-1 text-[11px] text-insight-summary bg-insight-summary/15 px-2.5 py-1 rounded-full">
                  <Lock size={10} />Шифрлэгдсэн
                </span>
              )}
              {!entry.is_text_saved && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  <FileText size={10} />Текст хадгалаагүй
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{formatDatetimeMn(entry.created_at)}</p>
          </div>

          <div className="space-y-4">
            <Section label="Гадаргуу"     content={entry.surface_text} />
            <Section label="Дотоод хариу" content={entry.inner_reaction_text} />
            <Section label="Утга"         content={entry.meaning_text} />
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">Seed Insight</h2>
              <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs"
                onClick={loadInsight} disabled={insightLoading}>
                {insightLoading
                  ? <Loader2 size={12} className="animate-spin" />
                  : insight ? <RefreshCw size={12} /> : <Eye size={12} />}
                {insight ? 'Дахин' : 'Харах'}
              </Button>
            </div>

            {insightLoading && (
              <div className="space-y-3 animate-pulse">
                {INSIGHT_CARDS.map((c) => <div key={c.key} className="h-20 rounded-2xl bg-muted/30" />)}
              </div>
            )}
            {insightError && <p className="text-sm text-destructive">{insightError}</p>}

            {insight && (
              <div className="space-y-3">
                {INSIGHT_CARDS.map((card) => {
                  const text = insight[card.key];
                  if (!text) return null;
                  return (
                    <div key={card.key} className={cn('p-4 rounded-2xl space-y-1', card.bg)}>
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2 h-2 rounded-full', card.dot)} />
                        <span className="text-xs font-semibold">{card.label}</span>
                        <span className="text-[11px] text-muted-foreground">{card.sub}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{text}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
