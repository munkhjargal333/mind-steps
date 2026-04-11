// ─────────────────────────────────────────────────────────────────────────────
// types/domain/index.ts
// Barrel export for all domain types
// Import from here to get all domain types organized by feature
// ─────────────────────────────────────────────────────────────────────────────

// Auth & User
export type { AuthUser, User, AdminUser } from './auth';

// Subscription
export type { Tier, Plan } from './subscription';

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
} from './journal';

// Insights
export type { SeedInsight, AnalyzeResult, DeepInsight } from './insight';

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
} from './emotion';

// Graph
export type { GraphNode, GraphEdge, GraphData } from './graph';

// Goals
export type {
  Goal,
  Milestone,
  GoalListResponse,
  GoalStatistics,
  MilestoneCompleteResponse,
} from './goal';

// Core Values
export type { CoreValue, Maslow, CoreValueListResponse } from './value';

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
} from './lesson';

// Gamification
export type {
  UserLevel,
  UserGamification,
  UserStreak,
  DashboardStats,
} from './gamification';

// Actions & Flow
export type {
  QuickActionType,
  FlowStep,
  SessionData,
  ActionConfig,
  StepCopy,
} from './action';

// UI
export type { NavItem } from './ui';

// API
export type {
  ApiResponse,
  JournalSearchParams,
  JournalSearchResponse,
  AdminStats,
  LlmConfig,
} from './api';
