// features/journal/services/journal.service.ts
// Business logic: orchestrates routing between authenticated & demo analysis
// Pure functions — NO React, NO hooks

import type { SessionData, AnalyzeResult } from '@/types';
import {
  createJournalEntry,
  analyzeDemoSession,
} from '../api/journal.api';

interface AnalysisConfig {
  token: string | null;
}

/**
 * Orchestrates analysis routing:
 * - token present  → authenticated endpoint (saves + returns insight)
 * - no token       → demo endpoint (rate-limited, no persistence)
 */
export async function analyzeSession(
  session: SessionData,
  config: AnalysisConfig
): Promise<AnalyzeResult> {
  const payload = {
    surface_text: session.surfaceText,
    inner_reaction_text: session.innerText,
    meaning_text: session.meaningText,
    save_text: true,
  };

  if (config.token) {
    const result = await createJournalEntry(config.token, payload);
    return {
      entryId: result.entry_id,
      insight: result.seed_insight,
    };
  }

  const result = await analyzeDemoSession({
    surface_text: payload.surface_text,
    inner_reaction_text: payload.inner_reaction_text,
    meaning_text: payload.meaning_text,
  });

  return {
    entryId: null,
    insight: result.seed_insight,
  };
}
