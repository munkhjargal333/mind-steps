// ════════════════════════════════════════════════════════════════════════════════
// features/emotions/components/EmotionStatsList.tsx
// Renders a list of emotion bars
// Uses design tokens exclusively - no hardcoded colors
// ════════════════════════════════════════════════════════════════════════════════

import type { EmotionStat } from '../types';
import { EmotionBar } from './EmotionBar';

export interface EmotionStatsListProps {
  stats: EmotionStat[];
}

export function EmotionStatsList({ stats }: EmotionStatsListProps) {
  const maxScore = Math.max(...stats.map((s) => s.score_sum), 1);

  return (
    <div className="space-y-3">
      {stats.map((stat) => (
        <EmotionBar key={stat.emotion} stat={stat} maxScore={maxScore} />
      ))}
    </div>
  );
}
