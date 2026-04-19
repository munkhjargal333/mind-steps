'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useTypeWriter } from '@/shared/hooks/useTypeWriter';
import type { SessionData, AnalyzeResult } from '@/core/api/types';

interface Props {
  session:          SessionData;
  analyzing:        boolean;
  result:           AnalyzeResult | null;
  error:            string | null;
  onMount:          (session: SessionData, onSuccess?: () => void) => void;
  onDone?:          () => void;
  onExpandRequest?: () => void;
}

// ── Highlight classes ─────────────────────────────────────────
const HL_BASE_1 = 'highlight highlight-variant-3 highlight-sky-300 after:opacity-40 highlight-spread-md';
const HL_BASE_2 = 'highlight highlight-variant-3 highlight-violet-300 after:opacity-40 highlight-spread-md';
const HL_BASE_3 = 'highlight highlight-variant-3 highlight-emerald-300 after:opacity-40 highlight-spread-md';

type CardKey = 'mirror' | 'reframe' | 'relief';

const CARD_LABEL: Record<CardKey, string> = {
  mirror:  'Өөрийгөө харвал',
  reframe: 'Өөр өнцөгөөс харвал',
  relief:  'Тайвшруулбал',
};

const CARD_LABEL_CLASS: Record<CardKey, string> = {
  mirror:  HL_BASE_1,
  reframe: HL_BASE_2,
  relief:  HL_BASE_3,
};

// ── Analyzing loader ──────────────────────────────────────────
const ANALYZE_MESSAGES = [
  'Таны хуваалцсан мэдрэмжийг уншиж байна…',
  'Утга болон дотоод байдлыг задлан шинжилж байна…',
  'Таны өнцгөөс ойлголт бэлтгэж байна…',
];

function AnalyzingLoader() {
  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(p => (p + 1) % ANALYZE_MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Wave bars */}
      <div className="flex items-end gap-[3px] h-7">
        {[8, 14, 20, 26, 20, 14, 8].map((h, i) => (
          <div
            key={i}
            className="w-[3px] rounded-sm bg-foreground animate-[waveBar_1.2s_ease-in-out_infinite]"
            style={{ height: h, animationDelay: `${i * 0.1}s`, opacity: 0.2 }}
          />
        ))}
      </div>

      {/* Message */}
      <div className="flex flex-col items-center gap-1.5 min-h-[3.5rem]">
        <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-sans font-medium">
          боловсруулж байна
        </span>
        <span
          className={cn(
            'text-sm text-muted-foreground font-serif text-center max-w-[200px] leading-relaxed transition-all duration-500',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5',
          )}
        >
          {ANALYZE_MESSAGES[idx]}
        </span>
      </div>

      {/* Orb dots */}
      <div className="flex gap-2.5 items-center">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-[7px] h-[7px] rounded-full bg-foreground animate-[orbPulse_1.6s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.2}s`, opacity: 0.15 }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-40 h-[1.5px] bg-border rounded-full overflow-hidden">
        <div className="h-full bg-muted-foreground rounded-full animate-[progressSlow_18s_linear_forwards]" />
      </div>
    </div>
  );
}

// ── Insight bubble with typewriter ────────────────────────────
function InsightBubble({
  text, cardKey, onDone,
}: {
  text:    string;
  cardKey: CardKey;
  onDone?: () => void;
}) {
  const typed    = useTypeWriter(text, 16);
  const isTyping = typed.length < text.length;

  useEffect(() => {
    if (!isTyping) onDone?.();
  }, [isTyping, onDone]);

  return (
    <div className={cn(
      'max-w-[90%] border rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2.5',
      'text-sm leading-relaxed border-border/30 font-serif',
    )}>
      {isTyping ? (
        <>
          {typed}
          <span className="inline-block w-0.5 h-3.5 bg-foreground/40 ml-0.5 align-middle animate-pulse" />
        </>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}

// ── Static bubble ─────────────────────────────────────────────
function StaticBubble({ text }: { text: string }) {
  return (
    <div className={cn(
      'max-w-[90%] border rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2.5',
      'text-sm leading-relaxed border-border/30 font-serif',
    )}>
      <span>{text}</span>
    </div>
  );
}

// ── Card label ────────────────────────────────────────────────
function CardLabel({ label, cardKey }: { label: string; cardKey: CardKey }) {
  return (
    <span className={cn(
      'text-[10px] font-bold tracking-widest uppercase pl-1 font-serif text-foreground/70',
      CARD_LABEL_CLASS[cardKey],
    )}>
      {label}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────
export function SeedInsightStep({
  session, analyzing, result, error, onMount, onDone, onExpandRequest,
}: Props) {
  const [phase, setPhase]             = useState<'reframe' | 'full'>('reframe');
  const [reframeDone, setReframeDone] = useState(false);
  const [mirrorDone, setMirrorDone]   = useState(false);
  const [reliefDone, setReliefDone]   = useState(false);

  useEffect(() => {
    onMount(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reliefDone) {
      const t = setTimeout(() => onDone?.(), 400);
      return () => clearTimeout(t);
    }
  }, [reliefDone, onDone]);

  // ── Loading ───────────────────────────────────────────────
  if (analyzing) return <AnalyzingLoader />;

  if (error) {
    return (
      <div className="px-4 py-3 rounded-2xl bg-destructive/10 text-destructive text-sm font-serif">
        {error}
      </div>
    );
  }

  if (!result) return null;

  const { mirror, reframe, relief } = result.insight;

  return (
    <div className="flex flex-col gap-4">

      {/* ── Reframe ── */}
      <div className="flex flex-col gap-1.5 items-start">
        <CardLabel label={CARD_LABEL.reframe} cardKey="reframe" />
        {phase === 'reframe' ? (
          <InsightBubble
            text={reframe}
            cardKey="reframe"
            onDone={() => setReframeDone(true)}
          />
        ) : (
          <StaticBubble text={reframe} />
        )}
      </div>

      {/* ── Товчнууд ── */}
      {phase === 'reframe' && reframeDone && (
        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
          <button
            onClick={() => { setPhase('full'); onExpandRequest?.(); }}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all font-serif',
              'border border-border bg-card text-foreground hover:bg-muted active:scale-95',
              'flex items-center justify-center gap-1.5',
            )}
          >
            ✦ Дэлгэрэнгүй авах
          </button>
          <button
            onClick={() => setReliefDone(true)}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all font-serif',
              'bg-foreground text-background hover:bg-foreground/90 active:scale-95',
            )}
          >
            Дуусгах
          </button>
        </div>
      )}

      {/* ── Full phase ── */}
      {phase === 'full' && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

          <div className="flex flex-col gap-1.5 items-start">
            <CardLabel label={CARD_LABEL.mirror} cardKey="mirror" />
            <InsightBubble
              text={mirror}
              cardKey="mirror"
              onDone={() => setMirrorDone(true)}
            />
          </div>

          {mirrorDone && (
            <div className="flex flex-col gap-1.5 items-start animate-in fade-in slide-in-from-bottom-1 duration-200">
              <CardLabel label={CARD_LABEL.relief} cardKey="relief" />
              <InsightBubble
                text={relief}
                cardKey="relief"
                onDone={() => setReliefDone(true)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}