// ─────────────────────────────────────────────────────────────────────────────
// types/types.ts
// Single source of truth for ALL domain types.
// Re-exports from domain modules for backward compatibility.
// Import from here everywhere — never from scattered local files.
// ─────────────────────────────────────────────────────────────────────────────

// Auth & User
export type { AuthUser, User, AdminUser } from './domain/auth';

// Subscription
export type { Tier, Plan } from './domain/subscription';

// Journal & Entries
export type {
  JournalEntry,
  PaginatedEntries,
  EntryCreateRequest,
  EntryCreateResponse,
  EntryResponse,
  PaginatedEntryResponse,
  DemoRequest,
  DemoResponse,
  Journal,
  JournalListResponse,
} from './domain/journal';

// Insights
export type { SeedInsight, AnalyzeResult, DeepInsight } from './domain/insight';

// Emotions & Mood
export type {
  EmotionStat,
  PlutchikEmotion,
  PlutchikCombination,
  MoodCategory,
  MoodUnit,
  MoodEntry,
  MoodEntryListResponse,
  MoodStatistics,
  MoodUnitListResponse,
  PlutchikCombinationListResponse,
} from './domain/emotion';

// Graph
export type { GraphNode, GraphEdge, GraphData } from './domain/graph';

// Goals
export type {
  Goal,
  Milestone,
  GoalListResponse,
  GoalStatistics,
  MilestoneCompleteResponse,
} from './domain/goal';

// Core Values
export type { CoreValue, Maslow, CoreValueListResponse } from './domain/value';

// Lessons
export type {
  Lesson,
  LessonCategory,
  LessonListResponse,
  CategoriesList,
  CreateLessonData,
  UpdateLessonData,
  CompleteLessonPayload,
  MeditationSession,
} from './domain/lesson';

// Gamification
export type {
  UserLevel,
  UserGamification,
  UserStreak,
  DashboardStats,
} from './domain/gamification';

// Actions & Flow
export type {
  QuickActionType,
  FlowStep,
  SessionData,
  ActionConfig,
  StepCopy,
} from './domain/action';

// UI
export type { NavItem } from './domain/ui';

// API
export type {
  ApiResponse,
  JournalSearchParams,
  JournalSearchResponse,
  AdminStats,
  LlmConfig,
} from './domain/api';