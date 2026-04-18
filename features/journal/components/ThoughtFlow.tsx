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
  onBack: () => void;
  onComplete: () => void;
  onReset: () => void;
  onUpgrade?: () => void;
}

// ── Shared bubble primitives (Theme-compliant Vintage Style) ───

function SystemBubble({ text }: { text: string }) {
  const typed = useTypeWriter(text, 18);

  return (
    <div className="flex flex-col gap-0.5 items-start">
      <div className="max-w-[85%] bg-card border border-border rounded-sm px-4 py-3 text-sm leading-relaxed text-foreground font-serif shadow-sm">
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
      <div className="max-w-[82%] bg-foreground text-background rounded-sm px-4 py-3 text-sm leading-relaxed font-serif shadow-sm border border-foreground">
        {text}
      </div>
    </div>
  );
}

function ThreadDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 border-t-[3px] border-double border-border" />
      <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-serif font-bold shrink-0">
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

// ── Main ───────────────────────────────────────────────────────

export function ThoughtFlow({ initialAction, onBack, onComplete, onReset }: Props) {
  const flow = useThoughtFlow(onBack);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [insightDone, setInsightDone] = useState(false);
  const [showExtendedOptions, setShowExtendedOptions] = useState(false);

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
  }, [flow.step, showTyping, flow.result, insightDone, showExtendedOptions]);

  const handleSend = useCallback(() => {
    const val = draft.trim();
    if (!val) return;

    if (flow.step === 1) flow.updateData({ surfaceText: val });
    else if (flow.step === 2) flow.updateData({ innerText: val });
    else if (flow.step === 3) flow.updateData({ meaningText: val });

    setDraft('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      flow.next();
    }, 650);
  }, [draft, flow]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const cfg = STEP_CONFIG[flow.actionType || ''];
  if (!flow.actionType || !cfg) return null;

  const session = { actionType: flow.actionType, ...flow.data };

  const currentPlaceholder =
    flow.step === 1 ? cfg.surface.placeholder
    : flow.step === 2 ? cfg.inner.placeholder
    : cfg.meaning.placeholder;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-0 bg-background text-foreground font-serif border-x border-border h-full shadow-sm">
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

      {/* Thread scroll area */}
      <div className="flex flex-col gap-4 px-5 py-5 overflow-y-auto flex-1">
        {/* ── Step 1 ── */}
        <SystemBubble text={cfg.surface.q} />

        {flow.data.surfaceText && (
          <>
            <UserBubble text={flow.data.surfaceText} />

            {flow.step >= 2 && (
              <>
                <ThreadDivider label="Дотоод" />
                <SystemBubble text={cfg.inner.q} />
              </>
            )}

            {flow.data.innerText && (
              <>
                <UserBubble text={flow.data.innerText} />

                {flow.step >= 3 && (
                  <>
                    <ThreadDivider label="Утга" />
                    <SystemBubble text={cfg.meaning.q} />
                  </>
                )}

                {flow.data.meaningText && (
                  <>
                    <UserBubble text={flow.data.meaningText} />
                    <ThreadDivider label="Ойлголт" />
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
              onMount={flow.runAnalysis}
              onDone={() => setInsightDone(true)}
            />
          </div>
        )}

        {insightDone && (
          <div className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
            {!showExtendedOptions ? (
              /* Эхний шат: Дэлгэрэнгүй авах / Дуусгах */
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-sm text-sm font-serif border-border text-foreground hover:bg-muted"
                  onClick={() => setShowExtendedOptions(true)}
                >
                  <Sparkles size={14} className="mr-2" /> Дэлгэрэнгүй авах
                </Button>
                <Button
                  className="flex-1 rounded-sm text-sm font-serif bg-foreground text-background hover:bg-foreground/90"
                  onClick={onComplete}
                >
                  Дуусгах
                </Button>
              </div>
            ) : (
              /* Хоёрдахь шат: Дахин / Нүүр хуудас */
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <Button
                  variant="outline"
                  className="flex-1 rounded-sm text-sm font-serif border-border text-foreground hover:bg-muted"
                  onClick={() => {
                    flow.reset();
                    setDraft('');
                    setInsightDone(false);
                    setShowExtendedOptions(false);
                    onReset();
                  }}
                >
                  <RefreshCw size={14} className="mr-2" /> Дахин
                </Button>
                <Button
                  className="flex-1 rounded-sm text-sm font-serif bg-foreground text-background hover:bg-foreground/90"
                  onClick={onComplete}
                >
                  Нүүр хуудас
                </Button>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input — steps 1–3 only */}
      {flow.step <= 3 && !showTyping && (
        <div className="px-5 pb-5 pt-4 border-t border-border bg-card">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => { setDraft(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder={currentPlaceholder}
              rows={1}
              className={cn(
                'flex-1 resize-none overflow-hidden text-sm leading-relaxed font-serif',
                'bg-background border border-border rounded-sm px-4 py-3',
                'placeholder:text-muted-foreground/60 text-foreground',
                'focus:outline-none focus:ring-1 focus:ring-ring transition-shadow shadow-inner',
              )}
              autoFocus
            />
            <button
              onClick={handleSend}
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

          {/* Step progress */}
          <div className="flex gap-2 justify-center mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300 border border-foreground',
                  s < flow.step  ? 'bg-muted-foreground border-muted-foreground'
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