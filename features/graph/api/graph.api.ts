// features/graph/api/graph.api.ts
// External API calls for value graph

import { apiClient } from '@/shared/lib/utils/api-client';
import type { GraphData } from '@/types';

export async function getValueGraph(token: string): Promise<GraphData> {
  return apiClient.get<GraphData>('/api/graph', token);
}
