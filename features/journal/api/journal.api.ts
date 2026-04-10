// ════════════════════════════════════════════════════════════════════════════════
// features/journal/services/journal.api.ts
// Journal feature API calls — pure functions, NO React
// ════════════════════════════════════════════════════════════════════════════════

import { apiClient } from '@/shared/lib/utils/api-client';
import type { SeedInsight, JournalEntry, PaginatedEntries } from '@/types';

// ─── Request / Response types ──────────────────────────────────────────────────

interface CreateEntryRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
  save_text?: boolean;
}

interface CreateEntryResponse {
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

// ─── Entries API ───────────────────────────────────────────────────────────────

/**
 * Create a new journal entry with AI analysis
 */
export async function createJournalEntry(
  token: string | null,
  payload: CreateEntryRequest
): Promise<CreateEntryResponse> {
  return apiClient.post<CreateEntryResponse>('/api/entries/', payload, token);
}

/**
 * List user's journal entries with pagination
 */
export async function listJournalEntries(
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
export async function getJournalEntry(
  token: string | null,
  entryId: string
): Promise<JournalEntry> {
  return apiClient.get<JournalEntry>(`/api/entries/${entryId}`, token);
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(
  token: string | null,
  entryId: string
): Promise<void> {
  return apiClient.delete<void>(`/api/entries/${entryId}`, token);
}

// ─── Demo / Anonymous Analysis ─────────────────────────────────────────────────

/**
 * Analyze a demo session (no auth required)
 */
export async function analyzeDemoSession(
  payload: DemoRequest
): Promise<DemoResponse> {
  return apiClient.post<DemoResponse>('/api/demo/seed-insight', payload);
}

/**
 * Get remaining demo attempts
 */
export async function getDemoRemaining(): Promise<{ remaining: number }> {
  return apiClient.get<{ remaining: number }>('/api/demo/remaining');
}

// ─── Insights API ──────────────────────────────────────────────────────────────

/**
 * Get seed insight for a specific entry
 */
export async function getSeedInsight(
  token: string | null,
  entryId: string
): Promise<SeedInsight & { summary: string }> {
  return apiClient.get<SeedInsight & { summary: string }>(
    `/api/insights/seed/${entryId}`,
    token
  );
}
