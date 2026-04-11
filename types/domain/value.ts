// ─────────────────────────────────────────────────────────────────────────────
// types/domain/value.ts
// Core Values & Maslow domain types
// ─────────────────────────────────────────────────────────────────────────────

export interface CoreValue {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  maslow_level_id?: number;
  color: string;
  icon?: string;
  priority_order: number;
  created_at: string;
}

export interface Maslow {
  id: number;
  level_number: number;
  name: string;
  description?: string;
  color?: string;
}

export interface CoreValueListResponse {
  core_values: CoreValue[];
  total: number;
}
