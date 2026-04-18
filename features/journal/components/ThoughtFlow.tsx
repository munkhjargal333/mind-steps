'use client';

// ThoughtFlow.tsx — Messenger-style continuous chat thread
// Хэрэглэгч болон систем ялгагдсан bubble, нэг thread-д урссан.
// Step 4: SeedInsightStep нь insight-уудыг нэг нэгээр chat bubble-аар
// харуулж, хэрэглэгч тус бүрт хариулна.

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { useThoughtFlow } from '../hooks/useThoughtFlow';
import { SeedInsightStep } from './SeedInsightStep';
import { STEP_CONFIG, ACTION_MAP } from '@/shared/constants';
import type { QuickActionType } from '@/core/api/types';

interface Props {
  initialAction: QuickActionType;
  onBack:       () => void;
  onComplete:   () => void;
  onReset:      () => void;
  onUpgrade?:   () => void;
}

// ── Shared bubble primitives ───────────────────────────────────

function SystemBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-0.5 items-start">
      <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 pl-1">
        Дэвтэр
      </span>
      <div className="max-w-[85%] bg-muted/60 border border-border/40 rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2.5 text-sm leading-relaxed text-foreground">
        {text}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-0.5 items-end">
      <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 pr-1">
        Та
      </span>
      <div className="max-w-[82%] bg-foreground text-background rounded-tl-2xl rounded-tr-sm rounded-br-sm rounded-bl-2xl px-4 py-2.5 text-sm leading-relaxed">
        {text}
      </div>
    </div>
  );
}

function ThreadDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-0.5">
      <div className="flex-1 h-px bg-border/30" />
      <span className="text-[10px] tracking-widest uppercase text-muted-foreground/35 font-medium shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/30" />
    </div>
  );
}

function TypingBubble() {
  return (
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
  );
}

// ── Main ───────────────────────────────────────────────────────

export function ThoughtFlow({ initialAction, onBack, onComplete, onReset }: Props) {
  const flow        = useThoughtFlow(onBack);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const [draft, setDraft]           = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [insightDone, setInsightDone] = useState(false);

  useEffect(() => {
    if (initialAction) flow.selectAction(initialAction);
  }, [initialAction, flow.selectAction]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [flow.step, showTyping, flow.result, insightDone]);

  const handleSend = useCallback(() => {
    const val = draft.trim();
    if (!val) return;

    if (flow.step === 1) flow.updateData({ surfaceText: val });
    else if (flow.step === 2) flow.updateData({ innerText: val });
    else if (flow.step === 3) flow.updateData({ meaningText: val });

    setDraft('');
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

  // Which question is active
  const currentPlaceholder =
    flow.step === 1 ? cfg.surface.placeholder
    : flow.step === 2 ? cfg.inner.placeholder
    : cfg.meaning.placeholder;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-0">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={15} /> Буцах
        </button>
        <div className="flex-1" />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground/50">
          {ACTION_MAP[flow.actionType]?.label ?? ''}
        </span>
      </div>

      {/* Thread scroll area */}
      <div className="flex flex-col gap-3 px-4 py-4 overflow-y-auto flex-1">

        {/* ── Step 1 ── */}
        <SystemBubble text={cfg.surface.q} />

        {flow.data.surfaceText && (
          <>
            <UserBubble text={flow.data.surfaceText} />

            {/* ── Step 2 ── */}
            {flow.step >= 2 && (
              <>
                <ThreadDivider label="Дотоод" />
                <SystemBubble text={cfg.inner.q} />
              </>
            )}

            {flow.data.innerText && (
              <>
                <UserBubble text={flow.data.innerText} />

                {/* ── Step 3 ── */}
                {flow.step >= 3 && (
                  <>
                    <ThreadDivider label="Утга" />
                    <SystemBubble text={cfg.meaning.q} />
                  </>
                )}

                {flow.data.meaningText && (
                  <>
                    <UserBubble text={flow.data.meaningText} />
                    <ThreadDivider label="Seed Insight" />
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Typing indicator between steps */}
        {showTyping && <TypingBubble />}

        {/* ── Step 4: Seed Insight cards — embedded in thread ── */}
        {flow.step === 4 && !showTyping && (
          <SeedInsightStep
            session={session}
            analyzing={flow.analyzing}
            result={flow.result}
            error={flow.error}
            onMount={flow.runAnalysis}
            onDone={() => setInsightDone(true)}
          />
        )}

        {/* Finish buttons — only after all insight cards answered */}
        {insightDone && (
          <div className="flex gap-2 mt-1 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-2xl text-xs"
              onClick={() => {
                flow.reset();
                setDraft('');
                setInsightDone(false);
                onReset();
              }}
            >
              <RefreshCw size={12} className="mr-1" /> Дахин
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-2xl text-xs"
              onClick={onComplete}
            >
              Нүүр хуудас
            </Button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input — steps 1–3 only */}
      {flow.step <= 3 && !showTyping && (
        <div className="px-4 pb-4 pt-2 border-t border-border/30">
          <div className="flex gap-2 items-end">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentPlaceholder}
              rows={2}
              className={cn(
                'flex-1 resize-none text-sm leading-relaxed',
                'bg-muted/40 border border-border/50 rounded-2xl px-4 py-2.5',
                'placeholder:text-muted-foreground/40',
                'focus:outline-none focus:ring-1 focus:ring-ring/30',
              )}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className={cn(
                'shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150',
                draft.trim()
                  ? 'bg-foreground text-background hover:opacity-80 active:scale-95'
                  : 'bg-muted text-muted-foreground/30 cursor-not-allowed',
              )}
            >
              {flow.step === 3 ? <Sparkles size={15} /> : <Send size={15} />}
            </button>
          </div>

          {/* Step progress pills */}
          <div className="flex gap-1.5 justify-center mt-2.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  s < flow.step  ? 'w-4 bg-foreground/40'
                  : s === flow.step ? 'w-6 bg-foreground'
                  : 'w-1.5 bg-border',
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}