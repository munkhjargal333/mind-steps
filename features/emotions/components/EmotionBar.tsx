// ════════════════════════════════════════════════════════════════════════════════
// features/emotions/components/EmotionBar.tsx
// Displays a single emotion stat as a progress bar
// Uses design tokens exclusively - no hardcoded colors
// ════════════════════════════════════════════════════════════════════════════════

import { cn } from '@/shared/lib/utils/utils';
import type { EmotionStat } from '../types';

export interface EmotionBarProps {
  stat: EmotionStat;
  maxScore: number;
}

export function EmotionBar({ stat, maxScore }: EmotionBarProps) {
  const percentage = (stat.score_sum / maxScore) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium capitalize">{stat.emotion}</span>
        <span className="text-muted-foreground text-xs">
          {stat.count}x · {stat.percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/70 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
