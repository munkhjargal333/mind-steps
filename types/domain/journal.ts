// ─────────────────────────────────────────────────────────────────────────────
// types/domain/journal.ts
// Journal & Entry domain types
// ─────────────────────────────────────────────────────────────────────────────

import type { SeedInsight } from './insight';

export interface JournalEntry {
  id: string;
  user_id: string;
  surface_text: string | null;
  inner_reaction_text: string | null;
  meaning_text: string | null;
  is_encrypted: boolean;
  is_text_saved: boolean;
  entry_index: number;
  created_at: string;
}

export interface PaginatedEntries {
  items: JournalEntry[];
  total: number;
  page: number;
  page_size: number;
}

// API Request/Response types
export interface EntryCreateRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
  save_text?: boolean;
}

export interface EntryCreateResponse {
  entry_id: string;
  seed_insight: SeedInsight;
  analysis_channel: string;
}

export interface EntryResponse {
  id: string;
  user_id: string;
  surface_text: string | null;
  inner_reaction_text: string | null;
  meaning_text: string | null;
  is_encrypted: boolean;
  is_text_saved: boolean;
  entry_index: number;
  created_at: string;
}

export interface PaginatedEntryResponse {
  items: EntryResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface DemoRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
}

export interface DemoResponse {
  seed_insight: SeedInsight;
  remaining: number;
  note: string;
}

// Legacy Journal types (for lib/types compatibility)
export interface Journal {
  id: number;
  user_id: string;
  title?: string;
  content: string;
  is_private: boolean;
  tags?: string;
  related_value_ids?: number[];
  created_at: string;
  updated_at: string;
}

export interface JournalListResponse {
  journals: Journal[];
  total: number;
  page: number;
  limit: number;
}
