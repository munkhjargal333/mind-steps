'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/core/auth/AuthContext';
import { cn } from '@/shared/lib/utils';
import { relativeTimeMn } from '@/shared/lib/date';
import { Loader2, ChevronDown, Sparkles, Check } from 'lucide-react';
import { listHumanInsights, acknowledgeHumanInsight } from '@/core/api';
import type { HumanInsight } from '@/core/api/types';

// ─── Style Constants ─────────────────────────────────────────────────────────
const HL_BASE   = 'highlight highlight-variant-1 highlight-blue-300 after:opacity-30 highlight-spread-md';
const HL_BOLD   = 'highlight highlight-variant-3 highlight-amber-500 after:opacity-30 highlight-spread-md';

const PATTERN_LABELS: Record<string, string> = {
  dominant_need: 'Гол хэрэгцээ',
  unmet_need_alert: 'Хангагдаагүй хэрэгцээ',
  dominant_emotion: 'Давамгай сэтгэл',
  high_intensity_emotion: 'Хурц сэтгэл',
  strong_need_connection: 'Хүчтэй холбоо',
  low_vibration_state: 'Доод түвшин',
  emotion_trend_analysis: 'Сэтгэлийн чиг',
  emotional_volatility: 'Хэлбэлзэл',
};

// ─── Shared Styles ───────────────────────────────────────────────────────────
const TEXT_STYLE = "text-sm md:text-base leading-relaxed text-stone-300 font-serif italic";

// ─── Sub-components ──────────────────────────────────────────────────────────

function InsightRow({ insight, onAck, isExpanded, onToggle }: { 
  insight: HumanInsight; onAck: (id: string) => void; isExpanded: boolean; onToggle: () => void;
}) {
  const label = PATTERN_LABELS[insight.pattern_type || ''] || 'ОЙЛГОЛТ';
  return (
    <div className="border-b border-stone-900">
      <button 
        onClick={onToggle} 
        className="w-full py-5 flex items-center justify-between px-2 hover:bg-stone-900/20 transition-all"
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-stone-600 w-8">{Math.round(insight.strength_score * 100)}%</span>
          <h3 className={cn(
            "text-[11px] uppercase tracking-[0.2em] font-bold transition-colors",
            isExpanded ? HL_BOLD : HL_BASE
          )}>
            {label}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {insight.acknowledged ? (
            <Check size={12} className="text-stone-600" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
          )}
          <ChevronDown size={14} className={cn("text-stone-700 transition-transform duration-300", isExpanded && "rotate-180")} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="overflow-hidden"
          >
            <div className="pb-6 px-12 space-y-4">
              <p className={TEXT_STYLE}>"{insight.insight_text}"</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-stone-600 font-mono uppercase">
                  {relativeTimeMn(insight.generated_at)}
                </span>
                {!insight.acknowledged && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAck(insight.id); }} 
                    className="flex items-center gap-2 text-[10px] font-bold text-amber-600 hover:text-amber-500 uppercase tracking-widest"
                  >
                    <Sparkles size={12} /> Ухаарлаа
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const { token } = useAuth();
  const [insights, setInsights] = useState<HumanInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await listHumanInsights(token, 20);
      setInsights(data);
    } catch { setError('Алдаа гарлаа'); } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleAck = async (id: string) => {
    if (!token) return;
    setInsights(prev => prev.map(i => i.id === id ? { ...i, acknowledged: true } : i));
    try { await acknowledgeHumanInsight(token, id); } catch { load(); }
  };

  const displayed = useMemo(() => {
    return [...insights].sort((a, b) => (a.acknowledged === b.acknowledged ? b.generated_at.localeCompare(a.generated_at) : a.acknowledged ? 1 : -1));
  }, [insights]);

  const heroInsight = displayed[0];
  const listInsights = displayed.slice(1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 selection:bg-amber-500/20">
      <div className="max-w-xl mx-auto px-6 py-12">
        
        {/* HEADER */}
        <header className="mb-12">
          <div className="flex justify-between items-end pb-3 border-b border-stone-900">
            <h1 className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-100">
              <span className={HL_BOLD}>Өөрийгөө танихуй</span>
            </h1>
            <span className="text-[10px] font-mono text-stone-600 uppercase">
              {new Date().toLocaleDateString('mn-MN')}
            </span>
          </div>
        </header>

        <main className="space-y-16">
          {loading ? (
            <div className="flex justify-center py-20 opacity-30"><Loader2 className="animate-spin" size={20} /></div>
          ) : displayed.length > 0 ? (
            <>
              {/* HERO */}
              <section className="space-y-8">
                <p className={TEXT_STYLE}>"{heroInsight.insight_text}"</p>
                <div className="flex items-center justify-between pt-5 border-t border-stone-900">
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest font-mono", HL_BOLD)}>
                      {PATTERN_LABELS[heroInsight.pattern_type || ''] || 'ОЙЛГОЛТ'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-600">{Math.round(heroInsight.strength_score * 100)}%</span>
                  </div>
                  {!heroInsight.acknowledged && (
                    <button onClick={() => handleAck(heroInsight.id)} className="flex items-center gap-2 text-[10px] font-bold text-amber-600 hover:text-amber-500 uppercase tracking-widest">
                      <Sparkles size={12} /> Ухаарлаа
                    </button>
                  )}
                </div>
              </section>

              {/* LIST */}
              {listInsights.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                      Бусад ойлголтууд
                    </h4>
                    <div className="h-px bg-stone-900 flex-1" />
                  </div>
                  <div className="flex flex-col">
                    {listInsights.map((insight) => (
                      <InsightRow 
                        key={insight.id} insight={insight} 
                        isExpanded={expandedId === insight.id} 
                        onToggle={() => setExpandedId(expandedId === insight.id ? null : insight.id)} 
                        onAck={handleAck} 
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}