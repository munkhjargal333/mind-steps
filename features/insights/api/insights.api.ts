// features/insights/api/insights.api.ts
// External API calls for insights — no business logic

import { apiClient } from '@/shared/lib/utils/api-client';
import type { DeepInsight, SeedInsight } from '../types';

export async function listDeepInsights(token: string): Promise<DeepInsight[]> {
  return apiClient.get<DeepInsight[]>('/api/insights/deep', token);
}

export async function getSeedInsight(
  token: string,
  entryId: string
): Promise<SeedInsight & { summary: string }> {
  return apiClient.get<SeedInsight & { summary: string }>(
    `/api/insights/seed/${entryId}`,
    token
  );
}
