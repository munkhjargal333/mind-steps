// Journal Feature Module Barrel Export

// API
export * from './services';

// Hooks
export { useThoughtFlow } from './hooks/useThoughtFlow';
export type { UseThoughtFlowReturn } from './hooks/useThoughtFlow';

// Types - re-export from central types (no local types folder needed)
// Import directly from @/types in components

// Components
export { ThoughtFlow } from './components/ThoughtFlow';
export { StepIndicator } from './components/StepIndicator';
export { SeedInsightStep } from './components/SeedInsightStep';
export { SurfaceStep } from './components/steps/SurfaceStep';
export { InnerReactionStep } from './components/steps/InnerReactionStep';
export { MeaningStep } from './components/steps/MeaningStep';
export { QuickActionButton } from './components/QuickActionButton';
export { ActionBadge } from './components/ActionBadge';
export { ActionCard } from './components/ActionCard';
export { TierPill } from './components/TierPill';

// Config
export * from './config';

// Types
export type {
  QuickActionType,
  FlowStep,
  SessionData,
  SeedInsight,
  AnalyzeResult,
  ActionConfig,
  StepCopy,
  Tier,
} from './types';
