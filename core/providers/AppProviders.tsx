// core/providers/AppProviders.tsx
// Core application providers wrapper

'use client';

import React from 'react';
import { AuthProvider } from '@/core/auth';
import { ToastProvider } from './ToastContext';
import { TierProvider } from './TierContext';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <AuthProvider>
        <ToastProvider>
          <TierProvider>
            {children}
          </TierProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
