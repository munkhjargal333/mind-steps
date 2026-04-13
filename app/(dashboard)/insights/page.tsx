'use client';

// app/(dashboard)/insights/page.tsx  ← ФАЙЛЫН БАЙРШИЛ
// INSIGHTS — "Би ямар хүн бэ?"
// Холболт:
//   GET  /api/patterns/human-insight?limit=20
//   POST /api/patterns/human-insight          (manual generate)
//   PATCH /api/patterns/human-insight/:id/ack

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { cn } from '@/shared/lib/utils';
import { relativeTimeMn } from '@/shared/lib/date';
import {
  Sparkles, Brain, Loader2, AlertCircle,
  CheckCheck, ChevronDown, ChevronUp, RefreshCw, Eye,
} from 'lucide-react';
import {
  listHumanInsights,
  generateHumanInsight,
  acknowledgeHumanInsight,
} from '@/core/api';
import type { HumanInsight } from '@/core/api/types';

// ─── Static config ────────────────────────────────────────────────────────────

const HIGHLIGHT: Record<string, { label: string; color: string; bg: string }> = {
  dominant_need:          { label: 'Гол хэрэгцээ',          color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
  unmet_need:             { label: 'Хангагдаагүй хэрэгцээ',  color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  dominant_emotion:       { label: 'Давамгай сэтгэл',        color: 'text-sky-600 dark:text-sky-400',       bg: 'bg-sky-50 dark:bg-sky-950/30'       },
  high_intensity_emotion: { label: 'Хурц сэтгэл',            color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-950/30'       },
  strong_need_connection: { label: 'Хүчтэй холбоо',          color: 'text-teal-600 dark:text-teal-400',     bg: 'bg-teal-50 dark:bg-teal-950/30'     },
  low_state:              { label: 'Доод түвшин',             color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
  emotion_trend:          { label: 'Сэтгэлийн чиг',          color: 'text-green-600 dark:text-green-400',   bg: 'bg-green-50 dark:bg-green-950/30'   },
  emotion_variance:       { label: 'Хэлбэлзэл',              color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/30'   },
};

// ─── Strength bar ─────────────────────────────────────────────────────────────

function StrengthBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn('h-full rounded-full', pct >= 70 ? 'bg-violet-500' : pct >= 40 ? 'bg-sky-500' : 'bg-muted-foreground/30')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground w-7 text-right">{pct}%</span>
    </div>
  );
}

// ─── Highlight pill ───────────────────────────────────────────────────────────

function HighlightPill({ type }: { type: string | null }) {
  if (!type) return null;
  const cfg = HIGHLIGHT[type];
  if (!cfg) return null;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold', cfg.color, cfg.bg)}>
      {cfg.label}
    </span>
  );
}

// ─── Latest insight hero ──────────────────────────────────────────────────────

function LatestCard({
  insight,
  onAck,
}: {
  insight: HumanInsight;
  onAck: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: insight.acknowledged ? undefined : 'oklch(0.7 0.15 280 / 0.4)' }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/20">
        <Sparkles size={13} className="text-violet-500" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Хамгийн сүүлийн ойлголт
        </span>
        {!insight.acknowledged && <span className="ml-auto w-2 h-2 rounded-full bg-violet-500" />}
      </div>

      <div className="px-4 py-4 space-y-3">
        <HighlightPill type={insight.highlight_type} />
        <p className="text-sm leading-relaxed text-foreground/85">{insight.insight_text}</p>
        <StrengthBar score={insight.strength_score} />
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-muted-foreground">{relativeTimeMn(insight.generated_at)}</span>
          {!insight.acknowledged && (
            <button
              onClick={() => onAck(insight.id)}
              className="flex items-center gap-1.5 text-[11px] text-violet-600 dark:text-violet-400 font-medium hover:opacity-70 transition-opacity"
            >
              <CheckCheck size={11} />
              Уншсан
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── History item ─────────────────────────────────────────────────────────────

function HistoryItem({
  insight,
  onAck,
}: {
  insight: HumanInsight;
  onAck: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('rounded-xl border bg-card overflow-hidden transition-all', !insight.acknowledged && 'border-violet-200 dark:border-violet-800/40')}>
      <button className="w-full flex items-start gap-3 px-3.5 py-3 text-left" onClick={() => setOpen(o => !o)}>
        <div className="mt-1 shrink-0">
          {insight.acknowledged
            ? <Eye size={13} className="text-muted-foreground/40" />
            : <span className="block w-2 h-2 rounded-full bg-violet-500 mt-0.5" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <HighlightPill type={insight.highlight_type} />
          <p className={cn('text-sm text-foreground/80 mt-1.5', !open && 'line-clamp-2')}>{insight.insight_text}</p>
          <p className="text-[10px] text-muted-foreground mt-1.5">{relativeTimeMn(insight.generated_at)}</p>
        </div>
        <div className="shrink-0 mt-1">
          {open ? <ChevronUp size={13} className="text-muted-foreground/50" /> : <ChevronDown size={13} className="text-muted-foreground/50" />}
        </div>
      </button>

      {open && (
        <div className="px-3.5 pb-3.5 space-y-2 border-t pt-3">
          <StrengthBar score={insight.strength_score} />
          {!insight.acknowledged && (
            <button
              onClick={() => onAck(insight.id)}
              className="flex items-center gap-1.5 text-[11px] text-violet-600 dark:text-violet-400 font-medium"
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
  const [insights, setInsights]     = useState<HumanInsight[]>([]);
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError]           = useState<string | null>(null);

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

  async function handleGenerate() {
    if (!token) return;
    setGenerating(true);
    setError(null);
    try {
      const fresh = await generateHumanInsight(token);
      setInsights(prev => [fresh, ...prev.filter(i => i.id !== fresh.id)]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Алдаа гарлаа');
    } finally {
      setGenerating(false);
    }
  }

  async function handleAck(id: string) {
    if (!token) return;
    try {
      await acknowledgeHumanInsight(token, id);
      setInsights(prev => prev.map(i => i.id === id ? { ...i, acknowledged: true } : i));
    } catch {
      // silent — non-critical
    }
  }

  const latest  = insights[0] ?? null;
  const history = insights.slice(1);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Ойлголтууд</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Чиний хэв маягийн дүн шинжилгээ</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating || loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium hover:bg-muted transition-all disabled:opacity-50"
        >
          {generating
            ? <Loader2 size={12} className="animate-spin" />
            : <RefreshCw size={12} />
          }
          Шинэчлэх
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={15} />{error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && insights.length === 0 && (
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
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium hover:bg-muted transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Ойлголт үүсгэх
          </button>
        </div>
      )}

      {/* Latest hero */}
      {!loading && latest && (
        <LatestCard insight={latest} onAck={handleAck} />
      )}

      {/* History */}
      {!loading && history.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-0.5">
            Өмнөх ойлголтууд
          </p>
          <div className="space-y-2">
            {history.map(i => (
              <HistoryItem key={i.id} insight={i} onAck={handleAck} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}