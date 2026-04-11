'use client';

import { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthLogic } from './hooks/useAuthLogic';

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthLogic();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
