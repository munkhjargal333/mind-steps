// features/graph/hooks/useGraph.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GraphData } from '@/types';
import { getValueGraph } from '../services/graph.service';

export function useGraph(token: string | null) {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getValueGraph(token);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refresh: fetch } as const;
}
