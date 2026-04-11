/**
 * Journal Feature Types
 */

export interface SeedInsightData {
  mirror: string;
  reframe: string;
  relief: string;
  summary: string;
}

export interface EntryCreateRequest {
  surface_text: string;
  inner_reaction_text: string;
  meaning_text: string;
  save_text?: boolean;
}

export interface EntryCreateResponse {
  entry_id: string;
  seed_insight: SeedInsightData;
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
  seed_insight: SeedInsightData;
  remaining: number;
  note: string;
}
