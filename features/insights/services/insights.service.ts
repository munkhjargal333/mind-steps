// ─────────────────────────────────────────────────────────────────────────────
// features/insights/services/insights.service.ts
// Feature-specific service for insights
// Implements API calls using apiClient
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from '@/shared/utils/api-client';
import type { DeepInsight, SeedInsight } from '@/types';

/**
 * Get seed insight for a specific entry
 */
export async function getSeedInsight(
  token: string | null,
  entryId: string
): Promise<SeedInsight & { summary: string }> {
  return apiClient.get<SeedInsight & { summary: string }>(
    `/api/insights/seed/${entryId}`,
    token
  );
}

/**
 * List deep insights aligned with Maslow's hierarchy
 */
export async function listDeepInsights(
  token: string | null
): Promise<DeepInsight[]> {
  return apiClient.get<DeepInsight[]>('/api/insights/deep', token);
}
