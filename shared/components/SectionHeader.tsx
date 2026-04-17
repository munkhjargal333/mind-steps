'use client';

import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: string;
  right?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  accent,
  right,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
      {accent && (
        <p className="text-lg font-semibold tracking-wide 
          bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 
          bg-clip-text text-transparent
          drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]
        ">
          {accent}
        </p>
      )}

        <h1 className="text-lg font-semibold tracking-tight mt-0.5">
          {title}
        </h1>

        {subtitle && (
          <p className="text-base text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {right && <div>{right}</div>}
    </div>
  );
}