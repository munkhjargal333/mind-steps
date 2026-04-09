// ─────────────────────────────────────────────────────────────────────────────
// features/insights/services/insights.service.ts
// Feature-specific service for insights
// Re-exports from lib/services/journal.service.ts for feature encapsulation
// ─────────────────────────────────────────────────────────────────────────────

export {
  listDeepInsights,
  getSeedInsight,
} from '@/lib/services/journal.service';

export type {
  DeepInsight,
  SeedInsight,
} from '@/types';
