// ─────────────────────────────────────────────────────────────────────────────
// features/insights/services/insights.service.ts
// Feature-specific service for insights
// Re-exports from lib/services/journal.service.ts for feature encapsulation
// ─────────────────────────────────────────────────────────────────────────────

export {
  listDeepInsights,
  getSeedInsight,
} from '@/features/entries/services/entries.service';

export type {
  DeepInsight,
  SeedInsight,
} from '@/types';
