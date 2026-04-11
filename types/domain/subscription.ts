// ─────────────────────────────────────────────────────────────────────────────
// types/domain/subscription.ts
// Subscription & Tier domain types
// ─────────────────────────────────────────────────────────────────────────────

export type Tier = 'demo' | 'free' | 'pro';

export interface Plan {
  id: string;
  name: string;
  tier: Tier;
  price: number;
  features: string[];
}
