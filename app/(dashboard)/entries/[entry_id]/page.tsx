'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Lock,
  RefreshCcw,
} from 'lucide-react';

import { useAuth } from '@/core/auth/AuthContext';
import { useEntry } from '@/features/journal';
import { getSeedInsight, type SeedInsight } from '@/core/api';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { formatDatetimeMn } from '@/shared/lib/date';
import { InsightCards } from '@/shared/components/InsightCard';

// ─── Sub-components ────────────────────────────────────────────────────────────

function ReflectionBlock({
  content,
  delay = 0,
}: {
  label: string;
  content: string | null;
  delay?: number;
}) {
  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="space-y-2"
    >
      <p className="text-[16px] leading-relaxed text-foreground/90 whitespace-pre-wrap font-mono">
        {content}
      </p>
    </motion.div>
  );
}

// animate-pulse-гүй skeleton блок
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={cn('bg-muted/40 rounded-xl', className)} />
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function EntryDetailPage({
  params,
}: {
  params: Promise<{ entry_id: string }>;
}) {
  const { entry_id } = use(params);
  const { token } = useAuth();
  const { entry, loading, error } = useEntry(token, entry_id);

  const [insight, setInsight] = useState<(SeedInsight & { summary?: string }) | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const loadInsight = useCallback(async () => {
    if (!token || !entry_id) return;
    setInsightLoading(true);
    setInsightError(null);
    try {
      const data = await getSeedInsight(token, entry_id);
      setInsight(data);
    } catch (err) {
      setInsightError(err instanceof Error ? err.message : 'Insight татахад алдаа гарлаа');
    } finally {
      setInsightLoading(false);
    }
  }, [token, entry_id]);

  useEffect(() => {
    if (entry && token && !insight) {
      loadInsight();
    }
  }, [entry, token, insight, loadInsight]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">

      {/* Navigation */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          href="/entries"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={16} />
          Бичлэгүүд рүү буцах
        </Link>
      </motion.div>

      {/* Entry Loading State — анивчдаггүй skeleton */}
      {loading && (
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="space-y-3 border-b pb-6">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-7 w-48" />
          </div>
          {/* Text block skeleton-ууд */}
          <div className="space-y-6">
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-20 w-full" />
            <SkeletonBlock className="h-14 w-3/4" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {entry && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* Header / Meta */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold tracking-tighter bg-foreground/5 px-2 py-0.5 rounded text-muted-foreground uppercase">
                  Entry #{entry.entry_index}
                </span>
                {entry.is_encrypted && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                    <Lock size={10} /> Шифрлэгдсэн
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {formatDatetimeMn(entry.created_at)}
              </h1>
            </div>

            {/* Reflection Texts */}
            <div className="grid gap-8">
              <ReflectionBlock
                label="Болсон явдал"
                content={entry.surface_text}
                delay={0.1}
              />
              <ReflectionBlock
                label="Дотоод мэдрэмж"
                content={entry.inner_reaction_text}
                delay={0.2}
              />
              <ReflectionBlock
                label="Утга учир"
                content={entry.meaning_text}
                delay={0.3}
              />
            </div>

            {/* Seed Insight Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-8 border-t border-dashed"
            >
              <InsightCards
                data={insight}
                loading={insightLoading}
                error={insightError}
                onRefresh={loadInsight}
                showRefresh={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 bg-destructive/10 rounded-full text-destructive">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Алдаа гарлаа</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Дахин ачаалах
          </Button>
        </div>
      )}
    </div>
  );
}