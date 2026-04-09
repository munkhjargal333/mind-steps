// ════════════════════════════════════════════════════════════════════════════════
// features/emotions/services/emotions.service.ts
// Service layer for emotion statistics API calls
// Pure functions - NO React, NO hooks, NO UI
// ════════════════════════════════════════════════════════════════════════════════

import type { EmotionStat } from '../types';

// ─── Internal helpers ─────────────────────────────────────────────────────────

const getBase = (): string =>
  process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const message =
      typeof body?.detail === 'string'
        ? body.detail
        : Array.isArray(body?.detail)
        ? body.detail.map((e: { msg: string }) => e.msg).join(', ')
        : `HTTP ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch emotion statistics for the user
 * @param token - Auth token
 * @param days - Number of days to look back (default: 30)
 * @returns Array of emotion statistics
 */
export async function getEmotionStats(
  token: string,
  days = 30
): Promise<EmotionStat[]> {
  const res = await fetch(`${getBase()}/api/stats/emotions?days=${days}`, {
    headers: authHeaders(token),
  });
  return handleResponse<EmotionStat[]>(res);
}
