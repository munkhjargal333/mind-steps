import { Suspense } from 'react';
import { HomeView, HomeViewSkeleton } from '@/features/journal';

export default function DemoPage() {
  return (
    <Suspense fallback={<HomeViewSkeleton />}>
      <HomeView demoMode />
    </Suspense>
  );
}
