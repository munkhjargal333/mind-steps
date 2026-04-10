// ─────────────────────────────────────────────────────────────────────────────
// features/entries/services/entries.service.ts
// Feature-specific service for entries
// Implements API calls using apiClient
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from '@/shared/utils/api-client';
import type { JournalEntry, PaginatedEntries } from '@/types';

interface CreateEntryRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
  save_text?: boolean;
}

/**
 * Create a new journal entry
 */
export async function createEntry(
  token: string | null,
  payload: CreateEntryRequest
): Promise<JournalEntry> {
  return apiClient.post<JournalEntry>('/api/entries/', payload, token);
}

/**
 * List user's journal entries with pagination
 */
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

/**
 * Get a single journal entry by ID
 */
export async function getEntry(
  token: string | null,
  entryId: string
): Promise<JournalEntry> {
  return apiClient.get<JournalEntry>(`/api/entries/${entryId}`, token);
}

/**
 * Delete a journal entry
 */
export async function deleteEntry(
  token: string | null,
  entryId: string
): Promise<void> {
  return apiClient.delete<void>(`/api/entries/${entryId}`, token);
}
