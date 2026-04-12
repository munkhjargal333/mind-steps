// lib/api/api.ts
// analyzeSession — ThoughtContextValue-г ашиглан tier-д тохирсон
// authenticated эсвэл demo endpoint дуудна.
//
// NOTE: Энэ файл @/lib/api/api path-аар import хийгддэг (legacy).
// Шинэ код нь @/features/journal/services эсвэл @/core/api/journalBackend ашиглана.

import type { SessionData, AnalyzeResult } from '@/types';
import type { useThoughtContext } from '@/core/providers';
import {
  analyzeAuthenticatedSession,
  analyzeDemoSession,
} from '@/features/journal/services';

export type { AnalyzeResult };

export async function analyzeSession(
  session: SessionData,
  ctx: useThoughtContext
): Promise<AnalyzeResult> {
  const { tier, token } = ctx;

  const payload = {
    surface_text: session.surfaceText,
    inner_reaction_text: session.innerText,
    meaning_text: session.meaningText,
  };

  if (tier === 'demo' || !token) {
    const res = await analyzeDemoSession(payload);
    return {
      entryId: null,
      insight: res.seed_insight,
    };
  }

  const res = await analyzeAuthenticatedSession(token, {
    ...payload,
    save_text: true,
  });

  return {
    entryId: res.entry_id,
    insight: res.seed_insight,
  };
}
