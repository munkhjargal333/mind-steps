import type {
  JournalEntry,
  PaginatedEntries,
  SeedInsight,
  EmotionStat,
  GraphData,
  DeepInsight,
  HumanInsight,
  Pattern,
  PatternSummary,
  TodaySnapshot,
} from '@/core/api/types';

// ─── Internal helpers ─────────────────────────────────────────────────────────

const getBase = (): string =>
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

// ─── Request / Response shapes (internal to service) ─────────────────────────

interface EntryCreateRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
  save_text?: boolean;
}

interface EntryCreateResponse {
  entry_id: string;
  seed_insight: SeedInsight & { summary: string };
  analysis_channel: string;
}

interface DemoRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
}

interface DemoResponse {
  seed_insight: SeedInsight & { summary: string };
  remaining: number;
  note: string;
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
): Promise<PaginatedEntries> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.page_size) query.set('page_size', String(params.page_size));
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${getBase()}/api/entries/?${query}`, {
    headers: authHeaders(token),
  });
  return handleResponse<PaginatedEntries>(res);
}

export async function getEntry(token: string, entryId: string): Promise<JournalEntry> {
  const res = await fetch(`${getBase()}/api/entries/${entryId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<JournalEntry>(res);
}

export async function deleteEntry(token: string, entryId: string): Promise<void> {
  const res = await fetch(`${getBase()}/api/entries/${entryId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

export async function analyzeAuthenticatedSession(
  token: string,
  payload: EntryCreateRequest
): Promise<EntryCreateResponse> {
  return createEntry(token, payload);
}

export async function analyzeDemoSession(payload: DemoRequest): Promise<DemoResponse> {
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

// ─── Stats & Graph ────────────────────────────────────────────────────────────

// API параметр: entries (тэмдэглэлийн тоо, 1–50), days биш
export async function getEmotionStats(token: string, entries = 10): Promise<EmotionStat[]> {
  const res = await fetch(`${getBase()}/api/stats/emotions?entries=${entries}`, {
    headers: authHeaders(token),
  });
  return handleResponse<EmotionStat[]>(res);
}

export async function getValueGraph(token: string): Promise<GraphData> {
  const res = await fetch(`${getBase()}/api/graph`, {
    headers: authHeaders(token),
  });
  return handleResponse<GraphData>(res);
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export async function listDeepInsights(token: string): Promise<DeepInsight[]> {
  const res = await fetch(`${getBase()}/api/insights/deep`, {
    headers: authHeaders(token),
  });
  return handleResponse<DeepInsight[]>(res);
}

export async function getSeedInsight(
  token: string,
  entryId: string
): Promise<SeedInsight & { summary: string }> {
  const res = await fetch(`${getBase()}/api/insights/seed/${entryId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<SeedInsight & { summary: string }>(res);
}
// ─── Today Snapshot ───────────────────────────────────────────────────────────

export async function getTodaySnapshot(token: string): Promise<TodaySnapshot> {
  const res = await fetch(`${getBase()}/api/today`, {
    headers: authHeaders(token),
  });
  return handleResponse<TodaySnapshot>(res);
}

// ─── Patterns ─────────────────────────────────────────────────────────────────

export async function listPatterns(
  token: string,
  params?: { limit?: number; unread_only?: boolean }
): Promise<Pattern[]> {
  const query = new URLSearchParams();
  if (params?.limit)       query.set('limit', String(params.limit));
  if (params?.unread_only) query.set('unread_only', 'true');

  const res = await fetch(`${getBase()}/api/patterns/?${query}`, {
    headers: authHeaders(token),
  });
  return handleResponse<Pattern[]>(res);
}

export async function getPatternSummary(token: string): Promise<PatternSummary> {
  const res = await fetch(`${getBase()}/api/patterns/summary`, {
    headers: authHeaders(token),
  });
  return handleResponse<PatternSummary>(res);
}

export async function acknowledgePattern(token: string, patternId: string): Promise<void> {
  const res = await fetch(`${getBase()}/api/patterns/${patternId}/ack`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

// ─── Human Insights ───────────────────────────────────────────────────────────

export async function listHumanInsights(
  token: string,
  limit = 10
): Promise<HumanInsight[]> {
  const res = await fetch(`${getBase()}/api/patterns/human-insight?limit=${limit}`, {
    headers: authHeaders(token),
  });
  return handleResponse<HumanInsight[]>(res);
}

export async function generateHumanInsight(
  token: string,
  patternRunId?: string | null
): Promise<HumanInsight> {
  const res = await fetch(`${getBase()}/api/patterns/human-insight`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ pattern_run_id: patternRunId ?? null }),
  });
  return handleResponse<HumanInsight>(res);
}

export async function acknowledgeHumanInsight(token: string, insightId: string): Promise<void> {
  const res = await fetch(`${getBase()}/api/patterns/human-insight/${insightId}/ack`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}