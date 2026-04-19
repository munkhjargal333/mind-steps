'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link'; // Next.js Link
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  Plus, 
  SearchIcon 
} from 'lucide-react';

// Core & Features
import { useAuth } from '@/core/auth/AuthContext';
import { useEntries } from '@/features/journal/hooks/useEntries';
import { 
  EntryCard, 
  EntriesSearch, 
  EntriesEmptyState, 
  EntriesPagination 
} from '@/features/journal';

// Shared UI
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Button } from '@/shared/ui';
import { Skeleton } from '@/shared/ui/skeleton'; // Скелетон байгаа гэж үзэв
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
    // Confirm-ийг арай гоё Modal-аар сольж болох ч одоогоор хэвээр үлдээв
    if (!confirm('Энэ бичлэгийг устгах уу?')) return;
    
    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      
      {/* ─── Header Section ─── */}
      <SectionHeader
        title="Миний тэмдэглэлүүд"
        subtitle={`Нийт ${total} бичлэг олдлоо`}
        right={
          
        <Link
          href="/write"
          className={cn(
            'flex items-center gap-1.5 px-3 py-2.5 rounded-sm border font-serif',
            'text-xs font-bold tracking-wide transition-all duration-150',
            'bg-foreground text-background border-foreground hover:bg-foreground/90 active:scale-[0.98]',
          )}
        >
          <Plus size={13} strokeWidth={2.5} />
          Шинэ бичлэг
        </Link>
        }
      />

      {/* ─── Search Bar ─── */}
      <div className="relative group">
        <EntriesSearch value={search} onChange={setSearch} />
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="min-h-[400px]">
        {/* Loading State with Skeletons */}
        {loading && !entries.length ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 text-destructive border border-destructive/10"
          >
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        ) : entries.length === 0 ? (
          /* Empty State */
          <EntriesEmptyState hasSearch={!!search} />
        ) : (
          /* List of Entries */
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
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