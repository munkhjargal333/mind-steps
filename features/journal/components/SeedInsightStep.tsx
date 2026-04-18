'use client';

import { useEffect, useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useTypeWriter } from '@/shared/hooks/useTypeWriter';
import type { SessionData, AnalyzeResult } from '@/core/api/types';

interface Props {
  session:   SessionData;
  analyzing: boolean;
  result:    AnalyzeResult | null;
  error:     string | null;
  onMount:   (session: SessionData) => void;
  onDone?:   () => void;
}

// ── Highlight styles ──────────────────────────────────────────
const HIGHLIGHT_STYLES = {
  mirror:  'bg-[var(--highlight-mirror)]  mix-blend-[var(--highlight-blend)] rounded-[3px] px-0.5 -mx-0.5',
  reframe: 'bg-[var(--highlight-reframe)] mix-blend-[var(--highlight-blend)] rounded-[3px] px-0.5 -mx-0.5',
  relief:  'bg-[var(--highlight-relief)]  mix-blend-[var(--highlight-blend)] rounded-[3px] px-0.5 -mx-0.5',
} as const;

type CardKey = keyof typeof HIGHLIGHT_STYLES;

const CARD_BG: Record<CardKey, string> = {
  mirror:  'bg-blue-50/60 dark:bg-blue-950/15',
  reframe: 'bg-violet-50/60 dark:bg-violet-950/15',
  relief:  'bg-emerald-50/60 dark:bg-emerald-950/15',
};

const CARD_LABEL: Record<CardKey, string> = {
  mirror:  'Mirror',
  reframe: 'Reframe',
  relief:  'Relief',
};

// ── Highlight phrase extractor ────────────────────────────────
function extractHighlightPhrases(text: string): string[] {
  const patterns = [
    /([^.,!?।\n]{6,35}(?:байна|байгаа|болно|болсон|болдог))/g,
    /([^.,!?।\n]{6,30}(?:чинь|минь|нь)(?:\s|$))/g,
    /[,.][\s]*([^.,!?।\n]{8,30}(?:гэж|учраас|тул|болохоор))/g,
  ];
  for (const pattern of patterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 0) {
      const best = matches
        .map(m => m[1].trim())
        .filter(p => p.length >= 8 && p.length <= 40)
        .sort((a, b) => b.length - a.length)[0];
      if (best) return [best];
    }
  }
  const segments = text.split(/[,،.!?।]/);
  const good = segments.map(s => s.trim()).filter(s => s.length >= 10 && s.length <= 40);
  if (good.length > 0) return [good[Math.floor(good.length / 2)]];
  return [];
}

function HighlightedText({ text, cardKey }: { text: string; cardKey: CardKey }) {
  const phrases = useMemo(() => extractHighlightPhrases(text), [text]);
  const highlightClass = HIGHLIGHT_STYLES[cardKey];
  if (phrases.length === 0) return <span>{text}</span>;

  const segments: { content: string; highlighted: boolean }[] = [];
  let remaining = text;
  for (const phrase of phrases) {
    const idx = remaining.indexOf(phrase);
    if (idx === -1) continue;
    if (idx > 0) segments.push({ content: remaining.slice(0, idx), highlighted: false });
    segments.push({ content: phrase, highlighted: true });
    remaining = remaining.slice(idx + phrase.length);
  }
  if (remaining) segments.push({ content: remaining, highlighted: false });

  return (
    <>
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <mark key={i} className={cn('bg-transparent inline transition-[background-color] duration-700 ease-out', highlightClass)}>
            {seg.content}
          </mark>
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </>
  );
}

// ── Insight bubble with typewriter ───────────────────────────
function InsightBubble({
  text, cardKey, onDone,
}: {
  text: string;
  cardKey: CardKey;
  onDone?: () => void;
}) {
  const typed = useTypeWriter(text, 16);
  const isTyping = typed.length < text.length;

  useEffect(() => {
    if (!isTyping) onDone?.();
  }, [isTyping, onDone]);

  return (
    <div className={cn(
      'max-w-[90%] border rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2.5',
      'text-sm leading-relaxed border-border/30 font-serif',
      CARD_BG[cardKey],
    )}>
      {isTyping ? (
        <>
          {typed}
          <span className="inline-block w-0.5 h-3.5 bg-foreground/40 ml-0.5 align-middle animate-pulse" />
        </>
      ) : (
        <HighlightedText text={text} cardKey={cardKey} />
      )}
    </div>
  );
}

// ── Static bubble (past cards) ────────────────────────────────
function StaticBubble({ text, cardKey }: { text: string; cardKey: CardKey }) {
  return (
    <div className={cn(
      'max-w-[90%] border rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2.5',
      'text-sm leading-relaxed border-border/30 font-serif',
      CARD_BG[cardKey],
    )}>
      <HighlightedText text={text} cardKey={cardKey} />
    </div>
  );
}

function CardLabel({ label }: { label: string }) {
  return (
    <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 pl-1 font-serif">
      {label}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────
export function SeedInsightStep({ session, analyzing, result, error, onMount, onDone }: Props) {
  // phase: 'reframe' → зөвхөн reframe, 'full' → mirror + relief нэмэгдэнэ
  const [phase, setPhase]           = useState<'reframe' | 'full'>('reframe');
  const [reframeDone, setReframeDone] = useState(false);
  // full phase-д mirror дуусмагц relief гарна
  const [mirrorDone, setMirrorDone] = useState(false);
  // relief дуусмагц onDone дуудна
  const [reliefDone, setReliefDone] = useState(false);

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

  // ── Loading ──────────────────────────────────────────────
  if (analyzing) {
    return (
      <div className="flex flex-col gap-0.5 items-start">
        <div className="bg-muted/60 border border-border/40 rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-3 flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
            />
          ))}
        </div>
      </div>
    );
  }

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

      {/* ── Reframe (үргэлж харагдана) ── */}
      <div className="flex flex-col gap-1.5 items-start">
        <CardLabel label={CARD_LABEL.reframe} />
        {phase === 'reframe' ? (
          <InsightBubble
            text={reframe}
            cardKey="reframe"
            onDone={() => setReframeDone(true)}
          />
        ) : (
          <StaticBubble text={reframe} cardKey="reframe" />
        )}
      </div>

      {/* ── Reframe дуусмагц 2 товч ── */}
      {phase === 'reframe' && reframeDone && (
        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
          <button
            onClick={() => setPhase('full')}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all font-serif',
              'border border-border bg-card text-foreground hover:bg-muted active:scale-95',
              'flex items-center justify-center gap-1.5',
            )}
          >
            <Sparkles size={12} />
            Дэлгэрэнгүй авах
          </button>
          <button
            onClick={onDone}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all font-serif',
              'bg-foreground text-background hover:bg-foreground/90 active:scale-95',
            )}
          >
            Дуусгах
          </button>
        </div>
      )}

      {/* ── Full phase: mirror + relief ── */}
      {phase === 'full' && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

          {/* Mirror */}
          <div className="flex flex-col gap-1.5 items-start">
            <CardLabel label={CARD_LABEL.mirror} />
            <InsightBubble
              text={mirror}
              cardKey="mirror"
              onDone={() => setMirrorDone(true)}
            />
          </div>

          {/* Relief — mirror дуусмагц гарна */}
          {mirrorDone && (
            <div className="flex flex-col gap-1.5 items-start animate-in fade-in slide-in-from-bottom-1 duration-200">
              <CardLabel label={CARD_LABEL.relief} />
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