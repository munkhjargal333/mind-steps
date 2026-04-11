/**
 * Journal Backend API Client
 * Connects to the new backend: NEXT_PUBLIC_API_BASE
 * All endpoints follow the OpenAPI spec.
 */

import type {
  SeedInsight,
  EntryCreateRequest,
  EntryCreateResponse,
  EntryResponse,
  PaginatedEntryResponse,
  DemoRequest,
  DemoResponse,
  AdminUser,
  LlmConfig,
  AdminStats,
  EmotionStat,
  GraphData,
  DeepInsight,
} from '@/shared/types';

const getBase = () =>
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  'http://localhost:8000';

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

// ─── Entries ──────────────────────────────────────────────────────────────────

export async function createEntry(
  token: string,
  payload: EntryCreateRequest
): Promise<EntryCreateResponse> {
  const res = await fetch(`${getBase()}/api/entries/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<EntryCreateResponse>(res);
}

export async function listEntries(
  token: string,
  params?: { page?: number; page_size?: number; search?: string }
): Promise<PaginatedEntryResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.page_size) query.set('page_size', String(params.page_size));
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${getBase()}/api/entries/?${query}`, {
    headers: authHeaders(token),
  });
  return handleResponse<PaginatedEntryResponse>(res);
}

export async function getEntry(token: string, entryId: string): Promise<EntryResponse> {
  const res = await fetch(`${getBase()}/api/entries/${entryId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<EntryResponse>(res);
}

export async function deleteEntry(token: string, entryId: string): Promise<void> {
  const res = await fetch(`${getBase()}/api/entries/${entryId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

// ─── Graph & Insights ─────────────────────────────────────────────────────────

export async function getValueGraph(token: string): Promise<GraphData> {
  const res = await fetch(`${getBase()}/api/graph`, {
    headers: authHeaders(token),
  });
  return handleResponse<GraphData>(res);
}

export async function listDeepInsights(token: string): Promise<DeepInsight[]> {
  const res = await fetch(`${getBase()}/api/insights/deep`, {
    headers: authHeaders(token),
  });
  return handleResponse<DeepInsight[]>(res);
}

export async function getSeedInsight(token: string, entryId: string): Promise<SeedInsight> {
  const res = await fetch(`${getBase()}/api/insights/seed/${entryId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<SeedInsight>(res);
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getEmotionStats(
  token: string,
  days = 30
): Promise<EmotionStat[]> {
  const res = await fetch(`${getBase()}/api/stats/emotions?days=${days}`, {
    headers: authHeaders(token),
  });
  return handleResponse<EmotionStat[]>(res);
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export async function demoSeedInsight(payload: DemoRequest): Promise<DemoResponse> {
  const res = await fetch(`${getBase()}/api/demo/seed-insight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<DemoResponse>(res);
}

export async function getDemoRemaining(): Promise<{ remaining: number }> {
  const res = await fetch(`${getBase()}/api/demo/remaining`);
  return handleResponse<{ remaining: number }>(res);
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function adminListUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${getBase()}/api/admin/users`, {
    headers: authHeaders(token),
  });
  return handleResponse<AdminUser[]>(res);
}

export async function adminInviteUser(
  token: string,
  email: string
): Promise<unknown> {
  const res = await fetch(`${getBase()}/api/admin/users/invite`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ email }),
  });
  return handleResponse<unknown>(res);
}

export async function adminDeleteUser(token: string, userId: string): Promise<void> {
  const res = await fetch(`${getBase()}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

export async function adminGetLlmConfig(token: string): Promise<LlmConfig> {
  const res = await fetch(`${getBase()}/api/admin/llm/config`, {
    headers: authHeaders(token),
  });
  return handleResponse<LlmConfig>(res);
}

export async function adminTestLlm(token: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${getBase()}/api/admin/llm/test`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  return handleResponse<{ ok: boolean; message?: string }>(res);
}

export async function adminGetStats(token: string): Promise<AdminStats> {
  const res = await fetch(`${getBase()}/api/admin/stats`, {
    headers: authHeaders(token),
  });
  return handleResponse<AdminStats>(res);
}
