// ─────────────────────────────────────────────────────────────────────────────
// features/insights/index.ts
// Public API for insights feature
// ─────────────────────────────────────────────────────────────────────────────

export { useInsights } from './hooks/useInsights';
export type { DeepInsight, SeedInsight } from './types';
export { listDeepInsights, getSeedInsight } from './services/insights.service';
