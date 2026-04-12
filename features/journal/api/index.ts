/**
 * Journal Feature API Client
 * Uses base ApiClient from core/api
 */

import { apiClient } from '@/core/api/client';
import type {
  SeedInsight,
  EntryCreateRequest,
  EntryCreateResponse,
  EntryResponse,
  PaginatedEntryResponse,
  DemoRequest,
  DemoResponse,
} from '@/shared/types';

const BASE_PATH = '';

function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ─── Entries ──────────────────────────────────────────────────────────────────

export async function createEntry(
  token: string,
  payload: EntryCreateRequest
): Promise<EntryCreateResponse> {
  return apiClient.post<EntryCreateResponse>(`${BASE_PATH}/api/entries/`, payload, {
    headers: getAuthHeaders(token),
  });
}

export async function listEntries(
  token: string,
  params?: { page?: number; page_size?: number; search?: string }
): Promise<PaginatedEntryResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.page_size) query.set('page_size', String(params.page_size));
  if (params?.search) query.set('search', params.search);

  const queryString = query.toString();
  const endpoint = `${BASE_PATH}/api/entries/${queryString ? `?${queryString}` : ''}`;
  
  return apiClient.get<PaginatedEntryResponse>(endpoint, {
    headers: getAuthHeaders(token),
  });
}

export async function getEntry(token: string, entryId: string): Promise<EntryResponse> {
  return apiClient.get<EntryResponse>(`${BASE_PATH}/api/entries/${entryId}`, {
    headers: getAuthHeaders(token),
  });
}

export async function deleteEntry(token: string, entryId: string): Promise<void> {
  return apiClient.delete<void>(`${BASE_PATH}/api/entries/${entryId}`, {
    headers: getAuthHeaders(token),
  });
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export async function demoSeedInsight(payload: DemoRequest): Promise<DemoResponse> {
  return apiClient.post<DemoResponse>(`${BASE_PATH}/api/demo/seed-insight`, payload);
}

export async function getDemoRemaining(): Promise<{ remaining: number }> {
  return apiClient.get<{ remaining: number }>(`${BASE_PATH}/api/demo/remaining`);
}
