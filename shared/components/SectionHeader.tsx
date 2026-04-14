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
          <p className="text-xs font-medium tracking-wide text-[color:var(--color-accent,theme(colors.amber.500))]">
            {accent}
          </p>
        )}

        <h1 className="text-lg font-semibold tracking-tight mt-0.5">
          {title}
        </h1>

        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {right && <div>{right}</div>}
    </div>
  );
}