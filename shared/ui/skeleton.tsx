// shared/ui/skeleton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Skeleton loading placeholder.
// Tailwind v4 + CSS tokens ашигладаг.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/shared/lib/utils';

interface SkeletonProps {
  className?: string;
}

/** Base shimmer block — animate-pulse wrapper */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/40',
        className,
      )}
    />
  );
}

// ─── Pre-built compound skeletons ────────────────────────────────────────────

/** EntryCard-ын skeleton — entries жагсаалт ачааллах үед ашиглана */
export function EntryCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-2xl border bg-card">
      {/* Index badge */}
      <Skeleton className="shrink-0 w-9 h-9 rounded-xl" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      {/* Action */}
      <div className="shrink-0 flex items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

/** InsightCard-ын skeleton — SeedInsightStep analyze хийх үед */
export function InsightCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-muted/30 space-y-2.5">
      <div className="flex items-center gap-2">
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

/** Generic list skeleton — n мөр */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <EntryCardSkeleton key={i} />
      ))}
    </div>
  );
}