// ════════════════════════════════════════════════════════════════════════════════
// features/emotions/types.ts
// Type definitions for the emotions feature
// ════════════════════════════════════════════════════════════════════════════════

export interface EmotionStat {
  emotion: string;
  score_sum: number;
  count: number;
  percentage: number;
}

export interface EmotionsFeatureState {
  stats: EmotionStat[];
  loading: boolean;
  error: string | null;
}
