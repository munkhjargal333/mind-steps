// ─────────────────────────────────────────────────────────────────────────────
// types/domain/api.ts
// Generic API domain types
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface JournalSearchParams {
  query?: string;
  tags?: string;
  from_date?: string;
  to_date?: string;
}

export interface JournalSearchResponse {
  journals: unknown[];
  total: number;
}

export interface AdminStats {
  total_users?: number;
  total_entries?: number;
  [key: string]: unknown;
}

export interface LlmConfig {
  model?: string;
  provider?: string;
  [key: string]: unknown;
}
