// ─────────────────────────────────────────────────────────────────────────────
// types/domain/emotion.ts
// Emotion & Mood domain types
// ─────────────────────────────────────────────────────────────────────────────

export interface EmotionStat {
  emotion: string;
  score_sum: number;
  count: number;
  percentage: number;
}

// Plutchik emotions
export interface PlutchikEmotion {
  id: number;
  name: string;
  opposite_emotion_id?: number;
  intensity_levels?: number[];
  color?: string;
}

export interface PlutchikCombination {
  id: number;
  emotion1_id: number;
  emotion2_id: number;
  result_emotion_id?: number;
  description?: string;
}

// Mood tracking
export interface MoodCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
}

export interface MoodUnit {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  intensity_scale?: number;
  color?: string;
  icon?: string;
}

export interface MoodEntry {
  id: number;
  user_id: string;
  mood_unit_id: number;
  core_value_id?: number;
  intensity: number;
  when_felt?: string;
  trigger_event?: string;
  coping_strategy?: string;
  notes?: string;
  location?: string;
  weather?: string;
  created_at: string;
  mood_unit?: MoodUnit;
}

export interface MoodEntryListResponse {
  entries: MoodEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface MoodStatistics {
  total_entries: number;
  period_days: number;
  average_intensity?: number;
  mood_distribution?: Record<number, number>;
}

export interface MoodUnitListResponse {
  mood_units: MoodUnit[];
  total: number;
  page: number;
  limit: number;
}

export interface PlutchikCombinationListResponse {
  combinations: PlutchikCombination[];
  total: number;
}
