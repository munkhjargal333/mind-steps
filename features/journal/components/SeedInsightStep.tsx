'use client';

// SeedInsightStep — AI-аас ирсэн insight-уудыг нэг нэгээр chat bubble-аар
// харуулж, хэрэглэгч "Тайвширлаа / Өөр өнцөг авъя" гэж хариулна.

import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { INSIGHT_CARDS } from '@/shared/constants';
import type { SessionData, AnalyzeResult } from '@/core/api/types';

interface Props {
  session:   SessionData;
  analyzing: boolean;
  result:    AnalyzeResult | null;
  error:     string | null;
  onMount:   (session: SessionData) => void;
  // callback when user finishes all cards
  onDone?:   (saved: string[]) => void;
}

const CARD_CONFIG = {
  mirror:  { label: 'Mirror',  action: 'Тайвширлаа',     next: 'Өөр өнцөг авъя' },
  reframe: { label: 'Reframe', action: 'Тухтай боллоо',  next: 'Давах зүйл байна уу' },
  relief:  { label: 'Relief',  action: 'Энийг авлаа',    next: 'Өөрөөр харъя' },
} as const;

type CardKey = keyof typeof CARD_CONFIG;

export function SeedInsightStep({
  session,
  analyzing,
  result,
  error,
  onMount,
  onDone,
}: Props) {
  const [revealedIdx, setRevealedIdx] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [choices, setChoices] = useState<Record<string, 'accept' | 'skip'>>({});

  useEffect(() => {
    onMount(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = INSIGHT_CARDS.filter((c) => c.key );

  function handleChoice(key: string, choice: 'accept' | 'skip') {
    const newChoices = { ...choices, [key]: choice };
    const newSaved   = choice === 'accept' ? [...saved, key] : saved;
    setChoices(newChoices);
    setSaved(newSaved);

    const nextIdx = revealedIdx + 1;
    if (nextIdx < cards.length) {
      setTimeout(() => setRevealedIdx(nextIdx), 350);
    } else {
      // All cards shown
      setTimeout(() => onDone?.(newSaved), 400);
    }
  }

  // ── Loading ────────────────────────────────────────────────────
  if (analyzing) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5 items-start">
          <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 pl-1">
            Дэвтэр
          </span>
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

  // ── Error ──────────────────────────────────────────────────────
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

  // ── Revealed cards ─────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      {cards.slice(0, revealedIdx + 1).map((card, idx) => {
        const cfg      = CARD_CONFIG[card.key as CardKey];
        const text     = insightTexts[card.key];
        const choice   = choices[card.key];
        const isCurrent = idx === revealedIdx;

        return (
          <div key={card.key} className="flex flex-col gap-2">
            {/* System insight bubble */}
            <div className="flex flex-col gap-0.5 items-start">
              <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 pl-1">
                {cfg.label}
              </span>
              <div
                className={cn(
                  'max-w-[90%] border rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2.5',
                  'text-sm leading-relaxed',
                  card.bg,
                  'border-border/30',
                )}
              >
                {text}
              </div>
            </div>

            {/* User choice — shown after they pick */}
            {choice && (
              <div className="flex flex-col gap-0.5 items-end">
                <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 pr-1">
                  Та
                </span>
                <div className="bg-foreground text-background rounded-tl-2xl rounded-tr-sm rounded-br-sm rounded-bl-2xl px-4 py-2.5 text-sm">
                  {choice === 'accept' ? cfg.action : cfg.next}
                </div>
              </div>
            )}

            {/* Choice buttons — only on current unreplied card */}
            {isCurrent && !choice && (
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