// shared/components/MainHeader.tsx
// Main header component

import React from 'react';

interface MainHeaderProps {
  title: string;
  subtitle?: string;
}

export function MainHeader({ title, subtitle }: MainHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
    </header>
  );
}
