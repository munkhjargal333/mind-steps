/**
 * Insights Feature API Client
 * Uses base ApiClient from core/api
 */

import { apiClient } from '@/core/api/client';
import type { SeedInsight, GraphData, DeepInsight } from '@/shared/types';

const BASE_PATH = '';

function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ─── Graph & Insights ─────────────────────────────────────────────────────────

export async function getValueGraph(token: string): Promise<GraphData> {
  return apiClient.get<GraphData>(`${BASE_PATH}/api/graph`, {
    headers: getAuthHeaders(token),
  });
}

export async function listDeepInsights(token: string): Promise<DeepInsight[]> {
  return apiClient.get<DeepInsight[]>(`${BASE_PATH}/api/insights/deep`, {
    headers: getAuthHeaders(token),
  });
}

export async function getSeedInsight(token: string, entryId: string): Promise<SeedInsight> {
  return apiClient.get<SeedInsight>(`${BASE_PATH}/api/insights/seed/${entryId}`, {
    headers: getAuthHeaders(token),
  });
}
