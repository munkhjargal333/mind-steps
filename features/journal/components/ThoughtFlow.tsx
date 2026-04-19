'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { useThoughtFlow } from '../hooks/useThoughtFlow';
import { useTypeWriter } from '@/shared/hooks/useTypeWriter';
import { SeedInsightStep } from './SeedInsightStep';
import { STEP_CONFIG, ACTION_MAP } from '@/shared/constants';
import type { QuickActionType } from '@/core/api/types';

interface Props {
  initialAction: QuickActionType;
  onBack:         () => void;
  onComplete:     (didExpand: boolean) => void;
  onReset:        () => void;
  onApiSuccess?:  () => void;
  onUpgrade?:     () => void;
}

// ── Highlight class ───────────────────────────────────────────
const HL_INSIGHT = 'highlight highlight-variant-3 highlight-amber-300 after:opacity-40 highlight-spread-md';

// ── Shared bubble primitives ──────────────────────────────────

function SystemBubble({ text }: { text: string }) {
  const typed = useTypeWriter(text, 18);
  return (
    <div className="flex flex-col gap-0.5 items-start">
      <div className="max-w-[85%] bg-card border border-border rounded-sm px-4 py-3 text-sm leading-relaxed text-foreground font-mono shadow-sm">
        {typed}
        {typed.length < text.length && (
          <span className="inline-block w-1.5 h-3.5 bg-foreground/70 ml-1 align-middle animate-pulse" />
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-0.5 items-end">
      <div className="max-w-[82%] bg-foreground text-background rounded-sm px-4 py-3 text-sm leading-relaxed font-mono shadow-sm border border-foreground">
        {text}
      </div>
    </div>
  );
}

function ThreadDivider({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 border-t-[3px] border-double border-border" />
      <span
        className={cn(
          'text-[10px] tracking-widest uppercase text-muted-foreground font-mono font-bold shrink-0',
          highlight && HL_INSIGHT,
        )}
      >
        {label}
      </span>
      <div className="flex-1 border-t-[3px] border-double border-border" />
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex flex-col gap-0.5 items-start">
      <div className="bg-card border border-border rounded-sm px-4 py-3 flex gap-2 items-center shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Word count helper ─────────────────────────────────────────
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const SHORT_INPUT_HINTS: Record<number, string> = {
  1: 'Бага зэрэг дэлгэрүүлж бичвэл илүү гүн ойлголт гарна. Юу болсныг тодруулж болох уу?',
  2: 'Дотоод мэдрэмжийг нэг өгүүлбэрээр ч гэсэн илүү нээлттэй бичиж үзнэ үү.',
  3: 'Энэ утга чухал юм шиг байна — арай дэлгэрэнгүй бичиж болох уу?',
};

// ── Main ──────────────────────────────────────────────────────

export function ThoughtFlow({ initialAction, onBack, onComplete, onReset, onApiSuccess }: Props) {
  const flow = useThoughtFlow(onBack);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [draft, setDraft]                       = useState('');
  const [showTyping, setShowTyping]             = useState(false);
  const [insightDone, setInsightDone]           = useState(false);
  const [expanded, setExpanded]                 = useState(false);
  const [hintForStep, setHintForStep]           = useState<Record<number, string>>({});
  const [extraBubbles, setExtraBubbles]         = useState<Record<number, string[]>>({});

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (initialAction) flow.selectAction(initialAction);
  }, [initialAction, flow.selectAction]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [flow.step, showTyping, flow.result, insightDone, expanded, hintForStep]);

  const handleSend = useCallback(() => {
    const val = draft.trim();
    if (!val) return;

    const step = flow.step;

    if (countWords(val) < 3) {
      if (step === 1) flow.updateData({ surfaceText: val });
      else if (step === 2) flow.updateData({ innerText: val });
      else if (step === 3) flow.updateData({ meaningText: val });

      setHintForStep(prev => ({
        ...prev,
        [step]: SHORT_INPUT_HINTS[step] ?? SHORT_INPUT_HINTS[1],
      }));
      setDraft('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      return;
    }

    if (step === 1) flow.updateData({ surfaceText: val });
    else if (step === 2) flow.updateData({ innerText: val });
    else if (step === 3) flow.updateData({ meaningText: val });

    setDraft('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      flow.next();
    }, 650);
  }, [draft, flow]);

  const handleSendAfterHint = useCallback(() => {
    const val = draft.trim();
    if (!val) return;
    const step = flow.step;

    const prev =
      step === 1 ? flow.data.surfaceText
      : step === 2 ? flow.data.innerText
      : flow.data.meaningText;

    const merged = prev ? `${prev}\n${val}` : val;
    if (step === 1) flow.updateData({ surfaceText: merged });
    else if (step === 2) flow.updateData({ innerText: merged });
    else if (step === 3) flow.updateData({ meaningText: merged });

    setExtraBubbles(prev => ({
      ...prev,
      [step]: [...(prev[step] ?? []), val],
    }));

    setDraft('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      flow.next();
    }, 650);
  }, [draft, flow]);

  const handleKeyDownWithHint = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const hasHint = !!hintForStep[flow.step];
      if (hasHint) handleSendAfterHint();
      else handleSend();
    }
  }, [hintForStep, flow.step, handleSend, handleSendAfterHint]);

  const cfg = STEP_CONFIG[flow.actionType || ''];
  if (!flow.actionType || !cfg) return null;

  const session = { actionType: flow.actionType, ...flow.data };
  const currentHint = hintForStep[flow.step];

  const currentPlaceholder =
    flow.step === 1 ? cfg.surface.placeholder
    : flow.step === 2 ? cfg.inner.placeholder
    : cfg.meaning.placeholder;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-0 bg-background text-foreground font-mono border-x border-border h-full shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b-4 border-double border-border bg-card">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ChevronLeft size={16} /> Буцах
        </button>
        <div className="flex-1" />
        <span className="text-[12px] font-bold tracking-widest uppercase text-foreground">
          {ACTION_MAP[flow.actionType]?.label ?? ''}
        </span>
      </div>

      {/* Thread */}
      <div className="flex flex-col gap-4 px-5 py-5 overflow-y-auto flex-1">

        {/* Step 1 */}
        <SystemBubble text={cfg.surface.q} />

        {flow.data.surfaceText && (
          <>
            <UserBubble text={flow.data.surfaceText.split('\n')[0]} />
            {hintForStep[1] && <SystemBubble text={hintForStep[1]} />}
            {(extraBubbles[1] ?? []).map((t, i) => (
              <UserBubble key={`s1-extra-${i}`} text={t} />
            ))}

            {flow.step >= 2 && (
              <>
                {/* Хуваагч шугамгүй, шууд дараагийн асуулт */}
                <SystemBubble text={cfg.inner.q} />
              </>
            )}

            {flow.data.innerText && (
              <>
                <UserBubble text={flow.data.innerText.split('\n')[0]} />
                {hintForStep[2] && <SystemBubble text={hintForStep[2]} />}
                {(extraBubbles[2] ?? []).map((t, i) => (
                  <UserBubble key={`s2-extra-${i}`} text={t} />
                ))}

                {flow.step >= 3 && (
                  <>
                    <SystemBubble text={cfg.meaning.q} />
                  </>
                )}

                {flow.data.meaningText && (
                  <>
                    <UserBubble text={flow.data.meaningText.split('\n')[0]} />
                    {hintForStep[3] && <SystemBubble text={hintForStep[3]} />}
                    {(extraBubbles[3] ?? []).map((t, i) => (
                      <UserBubble key={`s3-extra-${i}`} text={t} />
                    ))}

                    {/* Ойлголт — highlight-тай */}
                    <ThreadDivider label="Ойлголт" highlight />
                  </>
                )}
              </>
            )}
          </>
        )}

        {showTyping && <TypingBubble />}

        {flow.step === 4 && !showTyping && (
          <div className="bg-card border border-border rounded-sm p-4 shadow-sm">
            <SeedInsightStep
              session={session}
              analyzing={flow.analyzing}
              result={flow.result}
              error={flow.error}
              onMount={(s) => flow.runAnalysis(s, onApiSuccess)}
              onDone={() => setInsightDone(true)}
              onExpandRequest={() => setExpanded(true)}
            />
          </div>
        )}

        {insightDone && (
          <div className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
            {!expanded ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-sm text-sm font-mono border-border text-foreground hover:bg-muted"
                  onClick={() => setExpanded(true)}
                >
                  <Sparkles size={14} className="mr-2" /> Дэлгэрэнгүй авах
                </Button>
                <Button
                  className="flex-1 rounded-sm text-sm font-mono bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => onComplete(false)}
                >
                  Дуусгах
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <Button
                  variant="outline"
                  className="flex-1 rounded-sm text-sm font-mono border-border text-foreground hover:bg-muted"
                  onClick={() => {
                    flow.reset();
                    setDraft('');
                    setInsightDone(false);
                    setExpanded(false);
                    setHintForStep({});
                    setExtraBubbles({});
                    onReset();
                  }}
                >
                  <RefreshCw size={14} className="mr-2" /> Дахин
                </Button>
                <Button
                  className="flex-1 rounded-sm text-sm font-mono bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => onComplete(true)}
                >
                  Нүүр хуудас
                </Button>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {flow.step <= 3 && !showTyping && (
        <div className="px-5 pb-5 pt-4 border-t border-border bg-card">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => { setDraft(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDownWithHint}
              placeholder={currentHint ? 'Арай дэлгэрэнгүй бичиж үзнэ үү...' : currentPlaceholder}
              rows={1}
              className={cn(
                'flex-1 resize-none overflow-hidden text-sm leading-relaxed font-mono',
                'bg-background border rounded-sm px-4 py-3',
                'placeholder:text-muted-foreground/60 text-foreground',
                'focus:outline-none focus:ring-1 focus:ring-ring transition-shadow shadow-inner',
                'border-border',
              )}
              autoFocus
            />
            <button
              onClick={currentHint ? handleSendAfterHint : handleSend}
              disabled={!draft.trim()}
              className={cn(
                'shrink-0 w-11 h-11 rounded-sm flex items-center justify-center transition-all duration-150 border',
                draft.trim()
                  ? 'bg-foreground border-foreground text-background hover:bg-foreground/90 active:scale-95 shadow-sm'
                  : 'bg-muted border-border text-muted-foreground/40 cursor-not-allowed',
              )}
            >
              {flow.step === 3 ? <Sparkles size={18} /> : <Send size={18} />}
            </button>
          </div>

          <div className="flex gap-2 justify-center mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300 border border-foreground',
                  s < flow.step   ? 'bg-muted-foreground border-muted-foreground'
                  : s === flow.step ? 'bg-foreground'
                  : 'bg-transparent border-border',
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}