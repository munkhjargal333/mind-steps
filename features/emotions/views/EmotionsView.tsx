// ════════════════════════════════════════════════════════════════════════════════
// features/emotions/views/EmotionsView.tsx
// Main view component for the emotions feature
// Contains all rendering logic - page.tsx only imports and wraps with Suspense
// Uses design tokens exclusively - no hardcoded colors
// ════════════════════════════════════════════════════════════════════════════════

'use client';

import { BarChart2 } from 'lucide-react';
import { useEmotionStats } from '../hooks/useEmotionStats';
import { EmotionStatsList } from '../components/EmotionStatsList';
import { EmotionsSkeleton } from '../components/EmotionsSkeleton';
import { useThoughtContext } from '@/providers/TierProvider';

export function EmotionsView() {
  const { token } = useThoughtContext();
  const { stats, loading, error } = useEmotionStats(token);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Сэтгэл хөдлөл</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Плутчикийн сэтгэл хөдлөлийн хүрд
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && <EmotionsSkeleton />}

      {/* Empty State */}
      {!loading && stats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <BarChart2 size={32} className="opacity-30" />
          <p className="text-sm">Өгөгдөл байхгүй байна</p>
        </div>
      )}

      {/* Stats List */}
      {!loading && stats.length > 0 && (
        <EmotionStatsList stats={stats} />
      )}
    </div>
  );
}
