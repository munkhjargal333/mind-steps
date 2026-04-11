// core/providers/AppProviders.tsx
// Core application providers wrapper

'use client';

import React from 'react';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // Add global providers here (Theme, Auth, Query, etc.)
  return <>{children}</>;
}
