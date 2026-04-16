// app/(dashboard)/insights/page.tsx
// INSIGHTS — "Би ямар хүн бэ?"
// Холболт:
//   GET  /api/patterns/human-insight?limit=20
//   PATCH /api/patterns/human-insight/:id/ack


'use client'

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { cn } from '@/shared/lib/utils';
import { relativeTimeMn } from '@/shared/lib/date';
import {
  Brain, Loader2, AlertCircle,
  CheckCheck, ChevronDown, ChevronUp, Eye,
} from 'lucide-react';
import {
  listHumanInsights,
  acknowledgeHumanInsight,
} from '@/core/api';
import type { HumanInsight } from '@/core/api/types';
import { SectionHeader } from '@/shared/components/SectionHeader';

// ─── Static config ────────────────────────────────────────────────────────────

const PATTERN_TYPE: Record<string, { label: string; color: string; bg: string; bar: string; border: string; dot: string }> = {
  dominant_need:          { label: 'Гол хэрэгцээ',          color: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 dark:bg-violet-950/30',   bar: 'bg-violet-500',  border: 'border-violet-200 dark:border-violet-800/40',   dot: 'bg-violet-500'  },
  unmet_need_alert:       { label: 'Хангагдаагүй хэрэгцээ',  color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-950/30',   bar: 'bg-orange-500',  border: 'border-orange-200 dark:border-orange-800/40',   dot: 'bg-orange-500'  },
  dominant_emotion:       { label: 'Давамгай сэтгэл',        color: 'text-sky-700 dark:text-sky-300',       bg: 'bg-sky-50 dark:bg-sky-950/30',         bar: 'bg-sky-500',     border: 'border-sky-200 dark:border-sky-800/40',         dot: 'bg-sky-500'     },
  high_intensity_emotion: { label: 'Хурц сэтгэл',            color: 'text-red-700 dark:text-red-300',       bg: 'bg-red-50 dark:bg-red-950/30',         bar: 'bg-red-500',     border: 'border-red-200 dark:border-red-800/40',         dot: 'bg-red-500'     },
  strong_need_connection: { label: 'Хүчтэй холбоо',          color: 'text-teal-700 dark:text-teal-300',     bg: 'bg-teal-50 dark:bg-teal-950/30',       bar: 'bg-teal-500',    border: 'border-teal-200 dark:border-teal-800/40',       dot: 'bg-teal-500'    },
  low_vibration_state:    { label: 'Доод түвшин',             color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-50 dark:bg-indigo-950/30',   bar: 'bg-indigo-500',  border: 'border-indigo-200 dark:border-indigo-800/40',   dot: 'bg-indigo-500'  },
  emotion_trend_analysis: { label: 'Сэтгэлийн чиг',          color: 'text-green-700 dark:text-green-300',   bg: 'bg-green-50 dark:bg-green-950/30',     bar: 'bg-green-500',   border: 'border-green-200 dark:border-green-800/40',     dot: 'bg-green-500'   },
  emotional_volatility:   { label: 'Хэлбэлзэл',              color: 'text-amber-700 dark:text-amber-300',   bg: 'bg-amber-50 dark:bg-amber-950/30',     bar: 'bg-amber-500',   border: 'border-amber-200 dark:border-amber-800/40',     dot: 'bg-amber-500'   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLatestByType(insights: HumanInsight[]): HumanInsight[] {
  const map = new Map<string, HumanInsight>();
  for (const insight of insights) {
    const key = insight.pattern_type ?? 'unknown';
    const existing = map.get(key);
    if (!existing || insight.generated_at > existing.generated_at) {
      map.set(key, insight);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.strength_score - a.strength_score);
}

// ─── Strength bar ─────────────────────────────────────────────────────────────

function StrengthBar({ score, patternType }: { score: number; patternType?: string | null }) {
  const pct = Math.round(score * 100);
  const cfg = patternType ? PATTERN_TYPE[patternType] : null;
  const barColor = cfg?.bar ?? 'bg-muted-foreground/30';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
        <div className={cn('h-full rounded-full', barColor)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground w-7 text-right">{pct}%</span>
    </div>
  );
}

// ─── Type pill ────────────────────────────────────────────────────────────────

function TypePill({ type }: { type: string | null | undefined }) {
  if (!type) return null;
  const cfg = PATTERN_TYPE[type];
  if (!cfg) return null;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold', cfg.color, cfg.bg)}>
      {cfg.label}
    </span>
  );
}

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightItem({
  insight,
  onAck,
}: {
  insight: HumanInsight;
  onAck: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const type = insight.pattern_type;
  const cfg = type ? PATTERN_TYPE[type] : null;

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all',
      insight.acknowledged
        ? 'bg-card'
        : cn(cfg?.bg ?? 'bg-card', cfg?.border ?? 'border-violet-200 dark:border-violet-800/40'),
    )}>
      <button className="w-full flex items-start gap-3 px-3.5 py-3 text-left" onClick={() => setOpen(o => !o)}>
        <div className="mt-1 shrink-0">
          {insight.acknowledged
            ? <Eye size={13} className="text-muted-foreground/40" />
            : <span className={cn('block w-2 h-2 rounded-full mt-0.5', cfg?.dot ?? 'bg-violet-500')} />
          }
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <TypePill type={type} />
          <p className={cn('text-sm text-foreground/80', !open && 'line-clamp-2')}>{insight.insight_text}</p>
          <p className="text-[10px] text-muted-foreground">{relativeTimeMn(insight.generated_at)}</p>
        </div>
        <div className="shrink-0 mt-1">
          {open
            ? <ChevronUp size={13} className="text-muted-foreground/50" />
            : <ChevronDown size={13} className="text-muted-foreground/50" />
          }
        </div>
      </button>

      {open && (
        <div className="px-3.5 pb-3.5 space-y-2 border-t pt-3">
          <StrengthBar score={insight.strength_score} patternType={type} />
          {!insight.acknowledged && (
            <button
              onClick={() => onAck(insight.id)}
              className={cn('flex items-center gap-1.5 text-[11px] font-medium', cfg?.color ?? 'text-violet-600 dark:text-violet-400')}
            >
              <CheckCheck size={11} />
              Уншсан гэж тэмдэглэх
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const { token } = useAuth();
  const [insights, setInsights] = useState<HumanInsight[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await listHumanInsights(token, 20);
      setInsights(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function handleAck(id: string) {
    if (!token) return;
    try {
      await acknowledgeHumanInsight(token, id);
      setInsights(prev => prev.map(i => i.id === id ? { ...i, acknowledged: true } : i));
    } catch {
      // silent — non-critical
    }
  }

  const displayed = getLatestByType(insights);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-5">

      <SectionHeader
        title="Ойлголтууд"
        subtitle="Чиний хэв маягийн дүн шинжилгээ"
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={15} />{error}
        </div>
      )}

      {!loading && !error && displayed.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Brain size={22} className="text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-medium">Ойлголт байхгүй байна</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              Тэмдэглэл бичсэний дараа таны хэв маягийн дүн шинжилгээ автоматаар гарч ирнэ
            </p>
          </div>
        </div>
      )}

      {!loading && displayed.length > 0 && (
        <div className="space-y-2">
          {displayed.map(i => (
            <InsightItem key={i.id} insight={i} onAck={handleAck} />
          ))}
        </div>
      )}
    </div>
  );
}