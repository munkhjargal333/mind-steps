'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, Plus } from 'lucide-react';

// Core & Features
import { useAuth } from '@/core/auth/AuthContext';
import { useEntries } from '@/features/journal/hooks/useEntries';
import {
  EntryCard,
  EntriesSearch,
  EntriesEmptyState,
  EntriesPagination,
} from '@/features/journal';

// Shared UI
import { SectionHeader } from '@/shared/components/SectionHeader';
import { cn } from '@/shared/lib';

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
  } = useEntries({ token, pageSize: 10 });

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ бичлэгийг устгах уу?')) return;
    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Анхны ачааллалт — entries байхгүй, loading байгаа
  const isInitialLoading = loading && entries.length === 0;

  // Хуудас солих / хайх үеийн loading — entries аль хэдийн байгаа
  const isRefreshing = loading && entries.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* ─── Header ─── */}
      <SectionHeader
        title="Миний тэмдэглэлүүд"
        subtitle={`Нийт ${total} бичлэг олдлоо`}
        right={
          <Link
            href="/write"
            className={cn(
              'flex items-center gap-1.5 px-3 py-2.5 rounded-sm border font-mono',
              'text-xs font-bold tracking-wide transition-all duration-150',
              'bg-foreground text-background border-foreground',
              'hover:bg-foreground/90 active:scale-[0.98]',
            )}
          >
            <Plus size={13} strokeWidth={2.5} />
            Шинэ бичлэг
          </Link>
        }
      />

      {/* ─── Search ─── */}
      <EntriesSearch value={search} onChange={setSearch} />

      {/* ─── Content ─── */}
      <div>
        {isInitialLoading ? (
          /* Анхны ачааллалт: анивчдаггүй skeleton */
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[72px] w-full rounded-xl bg-muted/40"
              />
            ))}
          </div>

        ) : error ? (
          /* Алдаа */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 text-destructive border border-destructive/10"
          >
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>

        ) : entries.length === 0 ? (
          /* Хоосон төлөв */
          <EntriesEmptyState hasSearch={!!search} />

        ) : (
          /* Жагсаалт */
          <>
            {/* Хуудас солих үед жижиг spinner — entries алга болохгүй */}
            {isRefreshing && (
              <div className="flex justify-center pb-3">
                <Loader2 size={15} className="animate-spin text-muted-foreground" />
              </div>
            )}

            <div className={cn('space-y-4', isRefreshing && 'opacity-60 pointer-events-none transition-opacity')}>
              <AnimatePresence mode="popLayout">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      duration: 0.18,
                      delay: Math.min(index * 0.03, 0.15), // хамгийн ихдээ 150ms
                    }}
                  >
                    <EntryCard
                      entry={entry}
                      onDelete={handleDelete}
                      deleting={deletingId === entry.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <div className="pt-4 border-t border-dashed">
          <EntriesPagination
            page={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}