import { Suspense } from 'react';
import { GraphView } from '@/features/graph';

export default function GraphPage() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center animate-pulse" />}>
      <GraphView />
    </Suspense>
  );
}
