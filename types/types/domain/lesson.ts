// ─────────────────────────────────────────────────────────────────────────────
// types/domain/lesson.ts
// Lessons & Learning domain types
// ─────────────────────────────────────────────────────────────────────────────

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

export interface LessonListResponse {
  lessons: Lesson[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoriesList {
  lessons: LessonCategory[];
  total: number;
}

export interface CreateLessonData {
  title: string;
  slug?: string;
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
  is_premium?: boolean;
  is_published?: boolean;
  sort_order?: number;
}

export interface UpdateLessonData extends Partial<CreateLessonData> {}

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
