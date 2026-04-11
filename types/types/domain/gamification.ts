// ─────────────────────────────────────────────────────────────────────────────
// types/domain/gamification.ts
// Gamification & User Progress domain types
// ─────────────────────────────────────────────────────────────────────────────

export interface UserLevel {
  id: number;
  level_number: number;
  name: string;
  min_points: number;
  max_points?: number;
  badge_icon?: string;
  description?: string;
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

export interface DashboardStats {
  total_entries: number;
  total_goals: number;
  total_milestones: number;
  completed_milestones: number;
  level: number;
  points: number;
  streak_days: number;
}
