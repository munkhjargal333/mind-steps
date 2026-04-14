'use client';

// shared/components/SkeletonCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable skeleton placeholder.
// Replaces the local `Skel` helper in HomePage and the inline skeleton blocks
// in SeedInsightStep.  Import once, use everywhere.
//
// Variants:
//   "block"  — single rounded rect  (default, replaces <Skel className="h-..." />)
//   "card"   — multi-line insight card skeleton (replaces SeedInsightStep pulse)
//   "stat"   — 3-column stat row skeleton
//   "text"   — short text placeholder (header/body lines)
//
// Usage:
//   <SkeletonCard variant="block" className="h-[76px]" />
//   <SkeletonCard variant="card" repeat={3} />
//   <SkeletonCard variant="stat" />
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/shared/lib/utils';

interface SkeletonCardProps {
  variant?: 'block' | 'card' | 'stat' | 'text';
  /** How many card skeletons to render (variant="card" only) */
  repeat?: number;
  className?: string;
}

// ── Tiny primitive ─────────────────────────────────────────────────────────

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-muted', className)}
    />
  );
}

// ── Variant: single opaque block ────────────────────────────────────────────

function BlockSkeleton({ className }: { className?: string }) {
  return <Pulse className={cn('rounded-2xl', className)} />;
}

// ── Variant: insight / seed-insight card ────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-muted/30 space-y-2.5 animate-pulse">
      {/* Label row */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
        <div className="h-3 w-20 rounded bg-muted-foreground/15" />
      </div>
      {/* Body lines */}
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-muted-foreground/10" />
        <div className="h-3 w-4/5 rounded bg-muted-foreground/10" />
      </div>
    </div>
  );
}

// ── Variant: 3-column stat row ───────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="p-2.5 rounded-xl border bg-muted/20 text-center animate-pulse space-y-1"
        >
          <div className="h-5 w-10 mx-auto rounded bg-muted-foreground/15" />
          <div className="h-2.5 w-12 mx-auto rounded bg-muted-foreground/10" />
        </div>
      ))}
    </div>
  );
}

// ── Variant: text lines ──────────────────────────────────────────────────────

function TextSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-1.5 animate-pulse', className)}>
      <div className="h-3 w-3/4 rounded bg-muted-foreground/15" />
      <div className="h-3 w-1/2 rounded bg-muted-foreground/10" />
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

export function SkeletonCard({
  variant = 'block',
  repeat = 1,
  className,
}: SkeletonCardProps) {
  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: repeat }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
        <p className="text-center text-[11px] text-muted-foreground/40 animate-pulse">
          Уншиж байна...
        </p>
      </div>
    );
  }

  if (variant === 'stat') return <StatSkeleton />;
  if (variant === 'text') return <TextSkeleton className={className} />;

  return <BlockSkeleton className={className} />;
}