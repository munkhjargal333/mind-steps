// ════════════════════════════════════════════════════════════════════════════════
// features/emotions/hooks/useEmotionStats.ts
// Feature hook for emotion statistics
// Delegates API calls to emotions.service.ts
// ════════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import type { EmotionStat } from '../types';
import { getEmotionStats } from '../services/emotions.service';

export function useEmotionStats(token: string | null, days = 30) {
  const [stats, setStats] = useState<EmotionStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getEmotionStats(token, days)
      .then((data) => setStats(Array.isArray(data) ? data : []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Алдаа гарлаа'))
      .finally(() => setLoading(false));
  }, [token, days]);

  return { stats, loading, error } as const;
}
