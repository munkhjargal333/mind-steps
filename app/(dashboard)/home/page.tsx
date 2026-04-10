import { Suspense } from 'react';
import { HomeView, HomeViewSkeleton } from '@/features/journal';

export default function DashboardHomePage() {
  return (
    <Suspense fallback={<HomeViewSkeleton />}>
      <HomeView />
    </Suspense>
  );
}
