'use client';

import { useState } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { useEntries } from '@/features/entries/useEntries';
import { Loader2, AlertCircle } from 'lucide-react';
import { EntryCard, EntriesHeader, EntriesSearch, EntriesEmptyState, EntriesPagination } from '@/features/entries';

export default function EntriesPage() {
  const { token } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    entries,
    total,
    page,
    pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    remove,
  } = useEntries({ token, pageSize: 20 });

  const totalPages = Math.ceil(total / pageSize);

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ бичлэгийг устгах уу?')) return;
    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <EntriesHeader total={total} />

      <EntriesSearch value={search} onChange={setSearch} />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <EntriesEmptyState hasSearch={!!search} />
      )}

      {!loading && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onDelete={handleDelete}
              deleting={deletingId === entry.id}
            />
          ))}
        </div>
      )}

      <EntriesPagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setPage}
      />
    </div>
  );
}
