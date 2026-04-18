'use client';

import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { useTypeWriter } from '@/shared/hooks/useTypeWriter';
import { INSIGHT_CARDS } from '@/shared/constants';
import type { SessionData, AnalyzeResult } from '@/core/api/types';

interface Props {
  session:   SessionData;
  analyzing: boolean;
  result:    AnalyzeResult | null;
  error:     string | null;
  onMount:   (session: SessionData) => void;
  onDone?:   (saved: string[]) => void;
}

const CARD_CONFIG = {
  mirror:  { label: 'Mirror',  action: 'Ижил тал',    next: 'Өөр өнцөг авъя' },
  reframe: { label: 'Reframe', action: 'Өөрөөр сэтгэвэл', next: 'Давах зүйл байна уу' },
  relief:  { label: 'Relief',  action: 'Тайвшируулах',   next: 'Өөрөөр харъя' },
} as const;

type CardKey = keyof typeof CARD_CONFIG;

// ── Highlight style per card type ──────────────────────────────
const HIGHLIGHT_STYLES: Record<CardKey, string> = {
  mirror:  'bg-[var(--highlight-mirror)]  mix-blend-[var(--highlight-blend)] rounded-[3px] px-0.5 -mx-0.5',
  reframe: 'bg-[var(--highlight-reframe)] mix-blend-[var(--highlight-blend)] rounded-[3px] px-0.5 -mx-0.5',
  relief:  'bg-[var(--highlight-relief)]  mix-blend-[var(--highlight-blend)] rounded-[3px] px-0.5 -mx-0.5',
};

// ── Extract the most emotionally significant phrase ────────────
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

  // Fallback: pick a middle segment
  const segments = text.split(/[,،.!?।]/);
  const good = segments.map(s => s.trim()).filter(s => s.length >= 10 && s.length <= 40);
  if (good.length > 0) return [good[Math.floor(good.length / 2)]];

  return [];
}

// ── Render text with book-style highlighted phrases ────────────
function HighlightedText({
  text,
  cardKey,
  animate = false,
}: {
  text: string;
  cardKey: CardKey;
  animate?: boolean;
}) {
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
          <mark
            key={i}
            className={cn(
              'bg-transparent inline',
              highlightClass,
              animate && 'transition-[background-color] duration-700 ease-out',
            )}
          >
            {seg.content}
          </mark>
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </>
  );
}

// ── Single insight bubble with typewriter ─────────────────────

function InsightBubble({
  text,
  bg,
  cardKey,
  onDone,
}: {
  text: string;
  bg: string;
  cardKey: CardKey;
  onDone?: () => void;
}) {
  const typed = useTypeWriter(text, 16);
  const isTyping = typed.length < text.length;

  useEffect(() => {
    if (!isTyping) onDone?.();
  }, [isTyping, onDone]);

  return (
    <div
      className={cn(
        'max-w-[90%] border rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2.5',
        'text-sm leading-relaxed border-border/30',
        bg,
      )}
    >
      {isTyping ? (
        <>
          {typed}
          <span className="inline-block w-0.5 h-3.5 bg-foreground/40 ml-0.5 align-middle animate-pulse" />
        </>
      ) : (
        // Typing done → highlight fades in
        <HighlightedText text={text} cardKey={cardKey} animate />
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

export function SeedInsightStep({
  session,
  analyzing,
  result,
  error,
  onMount,
  onDone,
}: Props) {
  const [revealedIdx, setRevealedIdx] = useState(0);
  const [saved, setSaved]             = useState<string[]>([]);
  const [choices, setChoices]         = useState<Record<string, 'accept' | 'skip'>>({});
  const [cardTyped, setCardTyped]     = useState(false);

  useEffect(() => {
    onMount(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCardTyped(false);
  }, [revealedIdx]);

  const cards = INSIGHT_CARDS.filter((c) => c.key);

  function handleChoice(key: string, choice: 'accept' | 'skip') {
    const newChoices = { ...choices, [key]: choice };
    const newSaved   = choice === 'accept' ? [...saved, key] : saved;
    setChoices(newChoices);
    setSaved(newSaved);

    const nextIdx = revealedIdx + 1;
    if (nextIdx < cards.length) {
      setTimeout(() => setRevealedIdx(nextIdx), 350);
    } else {
      setTimeout(() => onDone?.(newSaved), 400);
    }
  }

  // ── Loading ────────────────────────────────────────────────
  if (analyzing) {
    return (
      <div className="flex flex-col gap-3">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded-2xl bg-destructive/10 text-destructive text-sm">
        {error}
      </div>
    );
  }

  if (!result) return null;

  const insightTexts: Record<string, string> = {
    mirror:  result.insight.mirror,
    reframe: result.insight.reframe,
    relief:  result.insight.relief,
  };

  return (
    <div className="flex flex-col gap-3">
      {cards.slice(0, revealedIdx + 1).map((card, idx) => {
        const cfg       = CARD_CONFIG[card.key as CardKey];
        const text      = insightTexts[card.key];
        const choice    = choices[card.key];
        const isCurrent = idx === revealedIdx;

        return (
          <div key={card.key} className="flex flex-col gap-2">

            <div className="flex flex-col gap-0.5 items-start">
              <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 pl-1">
                {cfg.label}
              </span>
              {isCurrent ? (
                <InsightBubble
                  text={text}
                  bg={card.bg}
                  cardKey={card.key as CardKey}
                  onDone={() => setCardTyped(true)}
                />
              ) : (
                // Past cards: static highlight
                <div
                  className={cn(
                    'max-w-[90%] border rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2.5',
                    'text-sm leading-relaxed border-border/30',
                    card.bg,
                  )}
                >
                  <HighlightedText text={text} cardKey={card.key as CardKey} />
                </div>
              )}
            </div>

            {choice && (
              <div className="flex flex-col gap-0.5 items-end">
                <div className="bg-foreground text-background rounded-tl-2xl rounded-tr-sm rounded-br-sm rounded-bl-2xl px-4 py-2.5 text-sm">
                  {choice === 'accept' ? cfg.action : cfg.next}
                </div>
              </div>
            )}

            {isCurrent && !choice && cardTyped && (
              <div className="flex gap-2 pl-1 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <button
                  onClick={() => handleChoice(card.key, 'accept')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-2xl text-xs font-medium transition-all',
                    'bg-foreground/90 text-background hover:bg-foreground active:scale-95',
                  )}
                >
                  {cfg.action}
                </button>
                <button
                  onClick={() => handleChoice(card.key, 'skip')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-2xl text-xs font-medium transition-all',
                    'bg-muted/60 border border-border/40 text-foreground',
                    'hover:bg-muted active:scale-95',
                  )}
                >
                  {cfg.next}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}