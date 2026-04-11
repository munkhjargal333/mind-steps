// shared/types/index.ts
// Re-export all types from @/types/types for shared layer usage
// This keeps the shared layer decoupled from direct domain imports

export type {
  // Auth & User
  AuthUser,
  User,
  AdminUser,
  
  // Subscription
  Tier,
  Plan,
  
  // Journal & Entries
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
  
  // Insights
  SeedInsight,
  AnalyzeResult,
  DeepInsight,
  
  // Emotions & Mood
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
  
  // Graph
  GraphNode,
  GraphEdge,
  GraphData,
  
  // Goals
  Goal,
  Milestone,
  GoalListResponse,
  GoalStatistics,
  MilestoneCompleteResponse,
  
  // Core Values
  CoreValue,
  Maslow,
  CoreValueListResponse,
  
  // Lessons
  Lesson,
  LessonCategory,
  LessonListResponse,
  CategoriesList,
  CreateLessonData,
  UpdateLessonData,
  CompleteLessonPayload,
  MeditationSession,
  
  // Gamification
  UserLevel,
  UserGamification,
  UserStreak,
  DashboardStats,
  
  // Actions & Flow
  QuickActionType,
  FlowStep,
  SessionData,
  ActionConfig,
  StepCopy,
  
  // UI
  NavItem,
  
  // API
  ApiResponse,
  JournalSearchParams,
  JournalSearchResponse,
  AdminStats,
  LlmConfig,
} from '@/types';
