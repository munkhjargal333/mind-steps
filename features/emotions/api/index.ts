/**
 * Emotion Feature API Client
 * Uses base ApiClient from core/api
 */

import { apiClient } from '@/core/api/client';
import type { EmotionStat } from '../types';

const BASE_PATH = '';

function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getEmotionStats(
  token: string,
  days = 30
): Promise<EmotionStat[]> {
  return apiClient.get<EmotionStat[]>(`${BASE_PATH}/api/stats/emotions?days=${days}`, {
    headers: getAuthHeaders(token),
  });
}
