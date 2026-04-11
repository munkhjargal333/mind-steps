/**
 * Journal Feature API Client
 * Connects to the new backend: NEXT_PUBLIC_API_BASE
 */

import type {
  SeedInsight,
  EntryCreateRequest,
  EntryCreateResponse,
  EntryResponse,
  PaginatedEntryResponse,
  DemoRequest,
  DemoResponse,
} from '../../../types/types';

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
