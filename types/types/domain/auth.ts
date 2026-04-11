// ─────────────────────────────────────────────────────────────────────────────
// types/domain/auth.ts
// Authentication & User domain types
// ─────────────────────────────────────────────────────────────────────────────

import type { Tier } from './subscription';

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

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  tier?: Tier;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  [key: string]: unknown;
}
