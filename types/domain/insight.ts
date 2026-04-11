// ─────────────────────────────────────────────────────────────────────────────
// types/domain/insight.ts
// Insight & Analysis domain types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core insight structure returned from analysis.
 * Used across journal, insights, and demo features.
 */
export interface SeedInsight {
  mirror: string;
  reframe: string;
  relief: string;
  summary?: string;
}

export interface AnalyzeResult {
  entryId: string | null;
  insight: SeedInsight;
}

export interface DeepInsight {
  id: string;
  content: string;
  created_at: string;
  [key: string]: unknown;
}
