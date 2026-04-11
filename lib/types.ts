// ─────────────────────────────────────────────────────────────────────────────
// lib/types.ts
// Re-export all types from types/types.ts for backward compatibility
// Also define additional domain types used across the application
// ─────────────────────────────────────────────────────────────────────────────

export * from '@/types/types';

// ─── User & Profile ──────────────────────────────────────────────────────────
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  tier?: 'demo' | 'free' | 'pro';
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_entries: number;
  total_goals: number;
  total_milestones: number;
  completed_milestones: number;
  level: number;
  points: number;
  streak_days: number;
}

export interface UserGamification {
  id: string;
  user_id: string;
  current_level_id: number;
  points: number;
  streak_days: number;
  created_at: string;
  updated_at: string;
  level?: UserLevel;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  created_at: string;
}

export interface UserLevel {
  id: number;
  level_number: number;
  name: string;
  min_points: number;
  max_points?: number;
  badge_icon?: string;
  description?: string;
}

// ─── Journal ─────────────────────────────────────────────────────────────────
export interface Journal {
  id: number;
  user_id: string;
  title?: string;
  content: string;
  is_private: boolean;
  tags?: string;
  related_value_ids?: number[];
  created_at: string;
  updated_at: string;
}

export interface JournalListResponse {
  journals: Journal[];
  total: number;
  page: number;
  limit: number;
}

// ─── Mood & Emotions ─────────────────────────────────────────────────────────
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

// ─── Goals & Milestones ──────────────────────────────────────────────────────
export interface Goal {
  id: number;
  user_id: string;
  value_id?: number;
  title: string;
  description?: string;
  goal_type: string;
  target_date?: string;
  priority: string;
  status: string;
  is_public: boolean;
  progress_percentage?: number;
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: number;
  goal_id: number;
  title: string;
  description?: string;
  target_date?: string;
  sort_order: number;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

// ─── Core Values ─────────────────────────────────────────────────────────────
export interface CoreValue {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  maslow_level_id?: number;
  color: string;
  icon?: string;
  priority_order: number;
  created_at: string;
}

export interface Maslow {
  id: number;
  level_number: number;
  name: string;
  description?: string;
  color?: string;
}

// ─── Lessons ─────────────────────────────────────────────────────────────────
export interface Lesson {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  description?: string;
  content: string;
  lesson_type: string;
  difficulty_level: string;
  required_level?: number;
  estimated_duration?: number;
  points_reward?: number;
  media_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  related_value_keywords?: string;
  related_emotion_keywords?: string;
  is_premium: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LessonCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parent_category_id?: number;
  sort_order: number;
}

export interface CompleteLessonPayload {
  lesson_id: number;
  time_spent: number;
  rating?: number;
  review?: string;
}

export interface MeditationSession {
  id: number;
  user_id: string;
  duration_seconds: number;
  meditation_type: string;
  completed: boolean;
  notes?: string;
  created_at: string;
}
