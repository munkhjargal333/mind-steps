// core/auth/manager.ts
// Core authentication manager

import type { AuthState, AuthSession } from './types';
import type { User } from '@/core/api/types';

class AuthManager {
  private state: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    session: null,
  };

  getState(): AuthState {
    return this.state;
  }

  setSession(session: AuthSession): void {
    this.state.session = session;
    this.state.isAuthenticated = !!session.user;
    this.state.isLoading = false;
  }

  clearSession(): void {
    this.state.session = null;
    this.state.isAuthenticated = false;
    this.state.isLoading = false;
  }

  getUser(): User | null {
    return this.state.session?.user ?? null;
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }
}

export const authManager = new AuthManager();
