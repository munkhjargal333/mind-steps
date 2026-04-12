// features/journal/types/index.ts
// Journal feature-specific types.
// Domain types shared across the whole app live in @/types.

// Re-export relevant domain types so feature internals import from here
export type {
  QuickActionType,
  FlowStep,
  SessionData,
  SeedInsight,
  AnalyzeResult,
  ActionConfig,
  StepCopy,
  Tier,
} from '@/types';
