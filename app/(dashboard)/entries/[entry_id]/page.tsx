'use client';

// app/(dashboard)/entries/[entry_id]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Entry detail + Seed Insight
//
// CHANGES from original:
//  • Seed Insight нь page mount-д автоматаар дуудагдана (товч устгагдсан)
//  • Entry ачаалж дууссаны дараа л insight дуудна (entry байх баталгаа)
//  • Refresh товч үлдсэн — дахин татах боломж хэрэгтэй
//  • SkeletonCard shared component ашиглана
//  • summary key нэмэгдсэн — API-с ирдэг ч харагддаггүй байсан
// ─────────────────────────────────────────────────────────────────────────────

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { InsightCards } from '@/shared/components/InsightCard';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Lock,
  FileText,
  RefreshCw,
} from 'lucide-react';

import { useAuth }          from '@/core/auth/AuthContext';
import { useEntry }         from '@/features/journal';
import { getSeedInsight }   from '@/core/api';
import { Button }           from '@/shared/ui/button';
import { cn }               from '@/shared/lib/utils';
import { formatDatetimeMn } from '@/shared/lib/date';
import { SkeletonCard }     from '@/shared/components/SkeletonCard';
import type { SeedInsight } from '@/core/api';

// ─── Insight card config ───────────────────────────────────────────────────────

const INSIGHT_CARDS = [
  {
    key:   'mirror'  as const,
    label: 'Mirror',
    sub:   'Чиний хэлснийг тусгавал',
    dot:   'bg-[color:var(--color-insight-mirror,theme(colors.blue.400))]',
    bg:    'bg-blue-50/60 dark:bg-blue-950/15',
  },
  {
    key:   'reframe' as const,
    label: 'Reframe',
    sub:   'Өнцгийг эргүүлэвэл',
    dot:   'bg-[color:var(--color-insight-reframe,theme(colors.violet.400))]',
    bg:    'bg-violet-50/60 dark:bg-violet-950/15',
  },
  {
    key:   'relief'  as const,
    label: 'Relief',
    sub:   'Ачааг хөнгөлөвөл',
    dot:   'bg-[color:var(--color-insight-relief,theme(colors.emerald.400))]',
    bg:    'bg-emerald-50/60 dark:bg-emerald-950/15',
  },
  {
    key:   'summary' as const,
    label: 'Summary',
    sub:   'Хураангуй',
    dot:   'bg-amber-400',
    bg:    'bg-amber-50/60 dark:bg-amber-950/15',
  },
] as const;

type InsightKey = (typeof INSIGHT_CARDS)[number]['key'];

// ─── Sub-components ────────────────────────────────────────────────────────────

function ReflectionBlock({
  label,
  content,
}: {
  label: string;
  content: string | null;
}) {
  if (!content) return null;

  return (
    <div className="space-y-1.5">
      {/* subtle label */}
      {/* <p className="text-[11px] text-muted-foreground/40">
        {label}
      </p> */}

      {/* main text */}
      <p className="text-[15px] leading-7 text-foreground/85 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}
// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EntryDetailPage({
  params,
}: {
  params: Promise<{ entry_id: string }>;
}) {
  const { entry_id } = use(params);
  const { token }    = useAuth();

  const { entry, loading, error } = useEntry(token, entry_id);

  const [insight, setInsight]               = useState<(SeedInsight & { summary?: string }) | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError]     = useState<string | null>(null);

  const loadInsight = async () => {
    if (!token || !entry_id) return;
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

  // Entry ирмэгц автоматаар insight дуудна — товч дарахгүй
  useEffect(() => {
    if (entry && token) {
      loadInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.id, token]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">

      {/* ── Back ────────────────────────────────────────────────────────── */}
      <Link href="/entries">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl gap-2 -ml-2 text-[color:var(--color-accent,theme(colors.amber.500))]"
        >
          <ArrowLeft size={14} />
          Бичлэгүүд
        </Button>
      </Link>

      {/* ── Entry loading ─────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* ── Entry error ───────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* ── Entry content ─────────────────────────────────────────────── */}
      {entry && (
        <>
          {/* Meta */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                #{entry.entry_index}
              </span>
              {entry.is_encrypted && (
                <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full">
                  <Lock size={10} />
                  Шифрлэгдсэн
                </span>
              )}
              {!entry.is_text_saved && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  <FileText size={10} />
                  Текст хадгалаагүй
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDatetimeMn(entry.created_at)}
            </p>
          </div>

          {/* Journal sections */}
          <div className="space-y-6">
            <ReflectionBlock
              label="Юу болсон бэ"
              content={entry.surface_text}
            />

            <ReflectionBlock
              label="Чи яаж мэдэрсэн"
              content={entry.inner_reaction_text}
            />

            <ReflectionBlock
              label="Энэ юу хэлж байна"
              content={entry.meaning_text}
            />
          </div>

          {/* ── Seed Insight — автоматаар ачаалагдана ─────────────────── */}
          <div className="pt-4 border-t">
            <InsightCards
              data={insight}
              loading={insightLoading}
              error={insightError}
              onRefresh={loadInsight}
              showRefresh
            />
          </div>
        </>
      )}
    </div>
  );
}