import { Suspense } from 'react';
import { EntriesView, EntriesSkeleton } from '@/features/entries';

export default function EntriesPage() {
  return (
    <Suspense fallback={<EntriesSkeleton />}>
      <EntriesView />
    </Suspense>
  );
}
