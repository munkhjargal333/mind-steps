'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/core/auth/AuthContext';
import { cn } from '@/shared/lib/utils';
import { relativeTimeMn } from '@/shared/lib/date';
import {
  Loader2, AlertCircle, Sparkles, Check
} from 'lucide-react';
import {
  listHumanInsights,
  acknowledgeHumanInsight,
} from '@/core/api';
import type { HumanInsight } from '@/core/api/types';

// ─── Editorial Config ────────────────────────────────────────────────────────

const PATTERN_LABELS: Record<string, string> = {
  dominant_need:          'Гол хэрэгцээ',
  unmet_need_alert:       'Хангагдаагүй хэрэгцээ',
  dominant_emotion:       'Давамгай сэтгэл',
  high_intensity_emotion: 'Хурц сэтгэл',
  strong_need_connection: 'Хүчтэй холбоо',
  low_vibration_state:    'Доод түвшин',
  emotion_trend_analysis: 'Сэтгэлийн чиг',
  emotional_volatility:   'Хэлбэлзэл',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function EditorialDivider({ label, sideText }: { label: string; sideText?: string }) {
  return (
    <div className="relative flex items-center mb-6">
      <div className="flex-none bg-[#0a0a0a] border border-stone-800 px-3 py-1 z-10">
        <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
          {label}
        </span>
      </div>
      <div className="flex-grow h-[1px] bg-stone-900 absolute w-full" />
      {sideText && (
        <div className="ml-auto bg-[#0a0a0a] pl-3 z-10">
           <span className="text-[10px] italic text-stone-600 font-serif">
            {sideText}
          </span>
        </div>
      )}
    </div>
  );
}

function InsightClipping({ insight, onAck, index }: { insight: HumanInsight; onAck: (id: string) => void; index: number }) {
  const label = PATTERN_LABELS[insight.pattern_type || ''] || 'ОЙЛГОЛТ';
  const pct = Math.round(insight.strength_score * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative mb-16 last:mb-0",
        insight.acknowledged && "opacity-60"
      )}
    >
      <EditorialDivider 
        label={label} 
        sideText={relativeTimeMn(insight.generated_at)} 
      />
      
      <div className="space-y-6 px-1">
        <p className="text-[18px] sm:text-[20px] leading-[1.8] text-stone-300 font-serif italic tracking-wide">
          “{insight.insight_text}”
        </p>

        <div className="flex items-end justify-between border-b border-stone-900 pb-4">
          <div className="space-y-1">
             <span className="text-[9px] text-stone-600 uppercase tracking-widest block font-mono">Intensity Score</span>
             <div className="flex items-center gap-2">
                <div className="h-1 w-24 bg-stone-900 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-700" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] font-mono text-stone-500">{pct}%</span>
             </div>
          </div>

          {!insight.acknowledged && (
            <button 
              onClick={() => onAck(insight.id)}
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-700 hover:text-amber-500 transition-colors"
            >
              <Sparkles size={12} />
              <span>Ухаарлаа</span>
            </button>
          )}
          
          {insight.acknowledged && (
             <span className="text-[9px] text-stone-700 uppercase tracking-tighter font-mono">
               Archived Section // 0{index + 1}
             </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const { token } = useAuth();
  const [insights, setInsights] = useState<HumanInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await listHumanInsights(token, 20);
      setInsights(data);
    } catch (e) {
      setError('Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleAck = async (id: string) => {
    if (!token) return;
    setInsights(prev => prev.map(i => i.id === id ? { ...i, acknowledged: true } : i));
    try {
      await acknowledgeHumanInsight(token, id);
    } catch {
      load();
    }
  };

  const displayed = useMemo(() => {
    const map = new Map<string, HumanInsight>();
    [...insights].sort((a, b) => b.generated_at.localeCompare(a.generated_at)).forEach(i => {
      const key = i.pattern_type || 'unknown';
      if (!map.has(key)) map.set(key, i);
    });
    return Array.from(map.values()).sort((a, b) => b.strength_score - a.strength_score);
  }, [insights]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 selection:bg-stone-800 selection:text-white">
      <div className="max-w-2xl mx-auto px-6 py-20 space-y-20">
        
        {/* Header Section */}
        <header className="space-y-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif italic tracking-tighter text-stone-100">
            Өөрийгөө танихуй
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-stone-800 flex-1" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold whitespace-nowrap">
              Editorial Analysis
            </span>
            <div className="h-px bg-stone-800 flex-1" />
          </div>
          <p className="text-sm font-serif italic text-stone-500 max-w-sm mx-auto leading-relaxed">
            Таны бичсэн тэмдэглэлүүдээс хиймэл оюун ухааны гаргаж авсан дотоод ертөнцийн дүр зураг.
          </p>
        </header>

        {/* Content Area */}
        <main className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-[10px] uppercase tracking-widest font-mono">Analyzing patterns...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20 border border-red-900/20 rounded-sm">
               <span className="text-xs font-serif italic text-red-500/70">{error}</span>
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-24 space-y-6 border border-dashed border-stone-900">
              <span className="text-sm font-serif italic text-stone-600 block">Одоогоор ямар нэгэн зүй тогтол ажиглагдаагүй байна.</span>
            </div>
          ) : (
            <div className="flex flex-col">
              {displayed.map((insight, idx) => (
                <InsightClipping 
                  key={insight.id} 
                  insight={insight} 
                  onAck={handleAck} 
                  index={idx}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer Editorial Mark */}
        {!loading && displayed.length > 0 && (
          <footer className="pt-20 text-center border-t border-stone-900">
            <div className="inline-block border border-stone-800 p-2 mb-4">
               <Check size={16} className="text-stone-700" />
            </div>
            <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] font-mono">
              End of Analysis // Archive 2026
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}