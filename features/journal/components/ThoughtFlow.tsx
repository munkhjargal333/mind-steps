'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, Send, Sparkles, Sprout } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useThoughtFlow } from '../hooks/useThoughtFlow';
import { useTypeWriter } from '@/shared/hooks/useTypeWriter';
import { STEP_CONFIG, ACTION_MAP, ALL_ACTIONS, GROWTH_ACTIONS } from '@/shared/constants';
import type { QuickActionType } from '@/core/api/types';

interface Props {
  onBack?: () => void
  onComplete: () => void
  onReset: () => void
  // Rate limit шалгах — false буцаавал flow руу ордоггүй
  onSelectAction?: (type: QuickActionType) => boolean
}

// ── Bubble primitives ──────────────────────────────────────────

function SystemBubble({ text }: { text: string }) {
  const typed = useTypeWriter(text, 18);
  return (
    <div className="flex items-start">
      <div className="max-w-[85%] bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm">
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
    <div className="flex justify-end">
      <div className="max-w-[82%] bg-foreground text-background rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start">
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm">
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

// ── Selectors ─────────────────────────────────────────────────

const MAIN_4_TYPES: QuickActionType[] = ['stress', 'loneliness', 'fear', 'self_doubt'];

function MainSelector({
  onSelect,
  onGrowth,
}: {
  onSelect: (t: QuickActionType) => void;
  onGrowth: () => void;
}) {
  const mainActions = ALL_ACTIONS.filter((a) => MAIN_4_TYPES.includes(a.type));
  return (
    <div className="flex items-start w-full">
      <div className="w-full max-w-[88%] bg-card border border-border rounded-2xl rounded-tl-sm px-3 py-3 shadow-sm space-y-1">
        {mainActions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.type}
              onClick={() => onSelect(a.type)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left"
            >
              <span className={cn('shrink-0', a.color)}>
                <Icon size={16} strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-foreground">{a.label}</span>
            </button>
          );
        })}
        <div className="border-t border-dashed border-border pt-1 mt-1">
          <button
            onClick={onGrowth}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left"
          >
            <span className="shrink-0 text-emerald-600 dark:text-emerald-400">
              <Sprout size={16} strokeWidth={1.75} />
            </span>
            <span className="text-sm font-medium text-foreground">Өсөлтийн тэмдэглэл</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function GrowthSelector({ onSelect }: { onSelect: (t: QuickActionType) => void }) {
  return (
    <div className="flex items-start w-full">
      <div className="w-full max-w-[88%] bg-card border border-border rounded-2xl rounded-tl-sm px-3 py-3 shadow-sm space-y-1">
        {GROWTH_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.type}
              onClick={() => onSelect(a.type)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left"
            >
              <span className={cn('shrink-0', a.color)}>
                <Icon size={16} strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-foreground">{a.label}</span>
              <span className="ml-auto text-[11px] text-muted-foreground shrink-0">{a.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Insight card ──────────────────────────────────────────────

function InsightCard({ emoji, label, text }: { emoji: string; label: string; text: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {emoji} {label}
      </p>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

// ── Progress dots ─────────────────────────────────────────────

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={cn(
            'w-1.5 h-1.5 rounded-full transition-all duration-300',
            s < step    ? 'bg-muted-foreground'
            : s === step ? 'bg-foreground'
            : 'bg-border',
          )}
        />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

export function ThoughtFlow({ onBack, onComplete, onReset, onSelectAction }: Props) {
  const flow = useThoughtFlow(onBack);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [draft, setDraft]                 = useState('');
  const [showTyping, setShowTyping]       = useState(false);
  const [selectorPhase, setSelectorPhase] = useState<'main' | 'growth'>('main');

  // insight state
  const [mirrorText, setMirrorText]       = useState('');
  const [reframeText, setReframeText]     = useState('');
  const [seedText, setSeedText]           = useState('');
  const [showMirror, setShowMirror]       = useState(false);
  const [deeperLoading, setDeeperLoading] = useState(false);
  const [showDeeper, setShowDeeper]       = useState(false);
  const [done, setDone]                   = useState(false);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [flow.step, showTyping, showMirror, showDeeper, done, selectorPhase, deeperLoading]);

  // step 4 → insight татна
  useEffect(() => {
    if (flow.step === 4 && !showMirror) {
      setShowTyping(true);
      flow.runAnalysis({
        actionType:  flow.actionType!,
        surfaceText: flow.data.surfaceText,
        innerText:   flow.data.innerText,
        meaningText: flow.data.meaningText,
      });
    }
  }, [flow.step]);

  // result ирэхэд mirror гаргана
  useEffect(() => {
    if (flow.result && !showMirror) {
      setShowTyping(false);
      setMirrorText(flow.result.insight.mirror   || '');
      setReframeText(flow.result.insight.reframe || '');
      setSeedText(flow.result.insight.relief     || '');
      setShowMirror(true);
    }
  }, [flow.result]);

  useEffect(() => {
    if (flow.error) setShowTyping(false);
  }, [flow.error]);

  const handleSend = useCallback(() => {
    const val = draft.trim();
    if (!val) return;
    if (flow.step === 1) flow.updateData({ surfaceText: val });
    else if (flow.step === 2) flow.updateData({ innerText: val });
    else if (flow.step === 3) flow.updateData({ meaningText: val });
    setDraft('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setShowTyping(true);
    setTimeout(() => { setShowTyping(false); flow.next(); }, 650);
  }, [draft, flow]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  // Action сонгогдох үед rate limit шалгуулна
  const handleSelectAction = useCallback((type: QuickActionType) => {
    // onSelectAction байхгүй бол (standalone) шууд орно
    const allowed = onSelectAction ? onSelectAction(type) : true;
    if (!allowed) return;
    setSelectorPhase('main');
    setShowTyping(true);
    setTimeout(() => { setShowTyping(false); flow.selectAction(type); }, 500);
  }, [flow, onSelectAction]);

  const handleGrowthClick = useCallback(() => {
    setShowTyping(true);
    setTimeout(() => { setShowTyping(false); setSelectorPhase('growth'); }, 400);
  }, []);

  const handleDeeperClick = useCallback(() => {
    setDeeperLoading(true);
    setTimeout(() => { setDeeperLoading(false); setShowDeeper(true); }, 600);
  }, []);

  const handleReset = useCallback(() => {
    flow.backToSelector();
    setDraft('');
    setShowMirror(false);
    setShowDeeper(false);
    setDeeperLoading(false);
    setDone(false);
    setSelectorPhase('main');
    onReset();
  }, [flow, onReset]);

  const cfg = flow.actionType ? STEP_CONFIG[flow.actionType] : null;

  const currentPlaceholder =
    flow.step === 1 ? cfg?.surface.placeholder
    : flow.step === 2 ? cfg?.inner.placeholder
    : cfg?.meaning.placeholder;

  const headerLabel = flow.actionType
    ? (ACTION_MAP[flow.actionType]?.label ?? 'Тэмдэглэл')
    : 'Тэмдэглэл';

  const isStep0  = flow.step === 0;
  const isAsking = flow.step >= 1 && flow.step <= 3;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-0 bg-background text-foreground h-full border-x border-border shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border bg-card shrink-0">
        <button
          onClick={() => {
            if (isStep0) {
              onBack?.();
            } else {
              if (flow.step >= 2) {
                flow.back();
              } else {
                flow.backToSelector();
                setShowMirror(false);
                setShowDeeper(false);
                setDeeperLoading(false);
                setDone(false);
              }
            }
          }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} /> Буцах
        </button>
        <div className="flex-1 text-center text-[13px] font-semibold text-foreground">
          {headerLabel}
        </div>
        <div className="w-14" />
      </div>

      {/* Messages scroll area */}
      <div className="flex flex-col gap-3 px-4 py-4 overflow-y-auto flex-1">

        {/* Step 0: selector */}
        {isStep0 && (
          <>
            <SystemBubble text="Өнөөдөр ямар сэдвээр бодлоо задлах вэ?" />
            {selectorPhase === 'main' && (
              <MainSelector onSelect={handleSelectAction} onGrowth={handleGrowthClick} />
            )}
            {selectorPhase === 'growth' && (
              <>
                <UserBubble text="Өсөлтийн тэмдэглэл" />
                <SystemBubble text="Ямар чиглэлээр тэмдэглэх вэ?" />
                <GrowthSelector onSelect={handleSelectAction} />
              </>
            )}
          </>
        )}

        {/* Steps 1–4: асуулт/хариулт thread */}
        {flow.step >= 1 && cfg && (
          <>
            <SystemBubble text={cfg.surface.q} />

            {flow.data.surfaceText && (
              <>
                <UserBubble text={flow.data.surfaceText} />
                {flow.step >= 2 && <SystemBubble text={cfg.inner.q} />}
              </>
            )}

            {flow.data.innerText && (
              <>
                <UserBubble text={flow.data.innerText} />
                {flow.step >= 3 && <SystemBubble text={cfg.meaning.q} />}
              </>
            )}

            {flow.data.meaningText && (
              <UserBubble text={flow.data.meaningText} />
            )}
          </>
        )}

        {showTyping && <TypingBubble />}

        {/* Mirror */}
        {showMirror && mirrorText && (
          <InsightCard emoji="🫂" label="Тань шиг" text={mirrorText} />
        )}

        {/* Mirror дараах 2 товч */}
        {showMirror && !showDeeper && !deeperLoading && !done && (
          <div className="flex gap-2">
            <button
              onClick={handleDeeperClick}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Өөр өнцгөөс харах
            </button>
            <button
              onClick={() => setDone(true)}
              className="flex-1 py-2.5 px-3 rounded-2xl border border-border bg-card text-foreground text-sm hover:bg-muted/60 transition-colors"
            >
              Дуусгах
            </button>
          </div>
        )}

        {deeperLoading && <TypingBubble />}

        {/* Reframe + Seed */}
        {showDeeper && (
          <div className="flex flex-col gap-2">
            {reframeText && <InsightCard emoji="🌀" label="Өөр өнцгөөс" text={reframeText} />}
            {seedText    && <InsightCard emoji="🌱" label="Таны хүч"    text={seedText}    />}
          </div>
        )}

        {/* Error */}
        {flow.error && (
          <div className="px-4 py-3 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
            {flow.error}
          </div>
        )}

        {/* Дуусах/Дахин товчнууд */}
        {(done || showDeeper) && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-2xl border border-border bg-card text-foreground text-sm hover:bg-muted/60 transition-colors"
            >
              Дахин
            </button>
            <button
              onClick={onComplete}
              className="flex-1 py-2.5 rounded-2xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Нүүр хуудас
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input — steps 1–3 */}
      {isAsking && !showTyping && (
        <div className="px-4 pb-5 pt-3 border-t border-border bg-card shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => { setDraft(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder={currentPlaceholder}
              rows={1}
              className={cn(
                'flex-1 resize-none overflow-hidden text-sm leading-relaxed',
                'bg-background border border-border rounded-2xl px-4 py-3',
                'placeholder:text-muted-foreground/50 text-foreground',
                'focus:outline-none focus:ring-1 focus:ring-ring transition-shadow',
              )}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className={cn(
                'shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150',
                draft.trim()
                  ? 'bg-foreground text-background hover:opacity-90 active:scale-95 shadow-sm'
                  : 'bg-muted text-muted-foreground/40 cursor-not-allowed',
              )}
            >
              {flow.step === 3 ? <Sparkles size={16} /> : <Send size={16} />}
            </button>
          </div>
          <div className="mt-3">
            <ProgressDots step={flow.step} />
          </div>
        </div>
      )}
    </div>
  );
}