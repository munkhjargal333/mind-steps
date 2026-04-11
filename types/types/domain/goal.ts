// ─────────────────────────────────────────────────────────────────────────────
// types/domain/goal.ts
// Goals & Milestones domain types
// ─────────────────────────────────────────────────────────────────────────────

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

export interface GoalListResponse {
  success: boolean;
  summary: {
    total: number;
    active: number;
    completed: number;
    paused: number;
  };
  goals: {
    active: Goal[];
    completed: Goal[];
    paused: Goal[];
  };
}

export interface GoalStatistics {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  paused_goals: number;
  total_milestones: number;
  completed_milestones: number;
  average_progress: number;
  goals_by_type: {
    short_term: number;
    long_term: number;
    habit: number;
  };
  goals_by_priority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface MilestoneCompleteResponse {
  success: boolean;
  milestone: Milestone;
  goal_progress: {
    percentage: number;
    status: string;
    is_complete: boolean;
  };
}
