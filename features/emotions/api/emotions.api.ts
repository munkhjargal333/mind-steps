// features/emotions/api/emotions.api.ts
// External API calls for emotion statistics — no business logic

import { apiClient } from '@/shared/lib/utils/api-client';
import type { EmotionStat } from '../types';

export async function getEmotionStats(
  token: string,
  days = 30
): Promise<EmotionStat[]> {
  return apiClient.get<EmotionStat[]>(`/api/stats/emotions?days=${days}`, token);
}
