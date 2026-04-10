import { Suspense } from 'react';
import { EntryDetailView } from './_view/EntryDetailView';

export default function EntryDetailPage({ params }: { params: Promise<{ entry_id: string }> }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16 animate-pulse" />}>
      <EntryDetailView params={params} />
    </Suspense>
  );
}
