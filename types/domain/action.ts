// ─────────────────────────────────────────────────────────────────────────────
// types/domain/action.ts
// Quick Actions & Flow domain types
// ─────────────────────────────────────────────────────────────────────────────

import type { LucideIcon } from 'lucide-react';
import type { Tier } from './subscription';

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
