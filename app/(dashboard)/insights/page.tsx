import { Suspense } from 'react';
import { InsightsView, InsightsSkeleton } from '@/features/insights';

export default function InsightsPage() {
  return (
    <Suspense fallback={<InsightsSkeleton />}>
      <InsightsView />
    </Suspense>
  );
}
