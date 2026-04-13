// core/api/types.ts
// Core API types for the system-level API layer

export interface ApiRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

export interface ApiResponseHandler<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}


// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    tier?: Tier;
  };
}

// ─── Tier / Subscription ──────────────────────────────────────────────────────
export type Tier = 'demo' | 'free' | 'pro';

// ─── Quick Actions ─────────────────────────────────────────────────────────────
export type QuickActionType =
  | 'stress'
  | 'loneliness'
  | 'gratitude'
  | 'self_doubt'
  | 'purpose'
  | 'values'
  | 'fear'
  | 'joy';

// ─── Thought Flow ─────────────────────────────────────────────────────────────
export type FlowStep = 1 | 2 | 3 | 4;

export interface SessionData {
  actionType: QuickActionType;
  surfaceText: string;
  innerText: string;
  meaningText: string;
}

// ─── Insight ──────────────────────────────────────────────────────────────────
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

// ─── Journal Entries ──────────────────────────────────────────────────────────
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

// ─── Emotions / Stats ─────────────────────────────────────────────────────────
export interface EmotionStat {
  emotion: string;
  score_sum: number;
  count: number;
  percentage: number;
}

// ─── Graph ────────────────────────────────────────────────────────────────────
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

// ─── Deep Insights ────────────────────────────────────────────────────────────
export interface DeepInsight {
  id: string;
  content: string;
  created_at: string;
  [key: string]: unknown;
}

// ─── Human Insights ───────────────────────────────────────────────────────────
export interface HumanInsight {
  id: string;
  insight_text: string;
  highlight_type: string | null;
  strength_score: number;
  generated_at: string;
  acknowledged: boolean;
  pattern_run_id?: string | null;
}

// ─── Patterns ─────────────────────────────────────────────────────────────────
export interface Pattern {
  id: string;
  pattern_type: string;
  pattern_data: Record<string, unknown>;
  strength_score: number;
  detected_at: string;
  acknowledged: boolean;
  run_id?: string | null;
  related_node_ids: string[];
}

export interface PatternSummary {
  dominant_need:            Record<string, unknown> | null;
  dominant_emotion:         Record<string, unknown> | null;
  low_state:                Record<string, unknown> | null;
  emotion_trend:            Record<string, unknown> | null;
  unmet_needs:              Record<string, unknown>[];
  strong_connections:       Record<string, unknown>[];
  high_intensity_emotions:  Record<string, unknown>[];
  emotion_variance:         Record<string, unknown> | null;
  latest_run_at:            string | null;
}

// ─── Today Snapshot ───────────────────────────────────────────────────────────
export interface TodaySnapshot {
  ewma:                number | null;
  entry_count:         number;
  top_patterns:        Record<string, unknown>[];
  last_seed:           SeedInsight | null;
  last_human_insight:  HumanInsight | null;
  dominant_emotion:    string | null;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  icon: any;
  href: string;
  label: string;
  isPro: boolean;
}

// ─── Action Config (UI catalog) ───────────────────────────────────────────────
import type { LucideIcon } from 'lucide-react';

export interface ActionConfig {
  type: QuickActionType;
  label: string;
  sub: string;
  icon: LucideIcon;
  tier: Tier;
  color: string;
  bg: string;
  ring: string;
  insightLabel?: string;
}

export interface StepCopy {
  surface: { q: string; placeholder: string };
  inner: { q: string; placeholder: string };
  meaning: { q: string; placeholder: string };
}

// ─── Aliases ──────────────────────────────────────────────────────────────────
// User is an alias for AuthUser for backward compatibility
export type { AuthUser as User };