// packages/api-types/src/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Canonical domain types shared between the Next.js web app and the
// FastAPI backend. No framework deps — pure TypeScript interfaces.
//
// Usage in web:   import type { JournalEntry } from '@mindsteps/api-types'
// Usage in backend codegen: npx ts-to-pydantic (or manual mirror)
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth / User ───────────────────────────────────────────────────────────────
export type Tier = 'demo' | 'free' | 'pro';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; avatar_url?: string };
  app_metadata?: { tier?: Tier };
}

// ── Quick Actions ─────────────────────────────────────────────────────────────
export type QuickActionType =
  | 'stress'
  | 'loneliness'
  | 'gratitude'
  | 'self_doubt'
  | 'purpose'
  | 'values'
  | 'fear'
  | 'joy';

export type FlowStep = 1 | 2 | 3 | 4;

export interface SessionData {
  actionType: QuickActionType;
  surfaceText: string;
  innerText: string;
  meaningText: string;
}

// ── Insights ──────────────────────────────────────────────────────────────────
export interface SeedInsight {
  mirror: string;
  reframe: string;
  relief: string;
  summary?: string;
}

export interface AnalyzeResult {
  entryId: string | null;
  insight: SeedInsight;
}

// ── Journal Entries ───────────────────────────────────────────────────────────
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

// ── Emotions / Stats ──────────────────────────────────────────────────────────
export interface EmotionStat {
  emotion: string;
  score_sum: number;
  count: number;
  percentage: number;
}

// ── Graph ─────────────────────────────────────────────────────────────────────
export interface GraphNode {
  id: string;
  label: string;
  [key: string]: unknown;
}

export interface GraphEdge {
  source: string;
  target: string;
  [key: string]: unknown;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  [key: string]: unknown;
}

// ── Deep Insights ─────────────────────────────────────────────────────────────
export interface DeepInsight {
  id: string;
  content: string;
  created_at: string;
  [key: string]: unknown;
}

// ── Navigation ────────────────────────────────────────────────────────────────
export interface NavItem {
  href: string;
  label: string;
  isPro: boolean;
}

// ── Payment ───────────────────────────────────────────────────────────────────
export type Plan = 'free' | 'pro';

export interface QPayInvoiceResult {
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  urls: unknown[];
  amount: number;
}

export interface QPayCheckResult {
  paid: boolean;
  rows: unknown[];
}
