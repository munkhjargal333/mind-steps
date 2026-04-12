// core/auth/types.ts
// Core authentication types

import type { User } from '@/core/api/types';

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AuthSession | null;
}
