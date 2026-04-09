// ════════════════════════════════════════════════════════════════════════════════
// features/emotions/components/EmotionsSkeleton.tsx
// Loading skeleton for emotions view
// Uses design tokens exclusively - no hardcoded colors
// ════════════════════════════════════════════════════════════════════════════════

export function EmotionsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
          <div className="h-2.5 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}
