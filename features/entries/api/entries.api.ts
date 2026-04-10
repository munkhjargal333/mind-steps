// features/entries/api/entries.api.ts
// External API calls for journal entries — NO business logic

import { apiClient } from '@/shared/lib/utils/api-client';
import type { JournalEntry, PaginatedEntries } from '@/types';

export async function listEntries(
  token: string | null,
  params?: { page?: number; page_size?: number; search?: string }
): Promise<PaginatedEntries> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.page_size) query.set('page_size', String(params.page_size));
  if (params?.search) query.set('search', params.search);
  return apiClient.get<PaginatedEntries>(`/api/entries/?${query}`, token);
}

export async function getEntry(
  token: string | null,
  entryId: string
): Promise<JournalEntry> {
  return apiClient.get<JournalEntry>(`/api/entries/${entryId}`, token);
}

export async function deleteEntry(
  token: string | null,
  entryId: string
): Promise<void> {
  return apiClient.delete<void>(`/api/entries/${entryId}`, token);
}

export async function createEntry(
  token: string | null,
  payload: {
    surface_text: string;
    inner_reaction_text: string;
    meaning_text: string;
    save_text?: boolean;
  }
): Promise<{ entry_id: string; seed_insight: unknown; analysis_channel: string }> {
  return apiClient.post('/api/entries/', payload, token);
}
