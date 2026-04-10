'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEntries } from '@/lib/hooks/useEntries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { EntryCard } from '@/features/entries/components/EntryCard';

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Бичлэгүүд</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Нийт {total} бичлэг
          </p>
        </div>
        <Link href="/home">
          <Button size="sm" className="rounded-xl gap-2">
            <BookOpen size={14} />
            Шинэ
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Хайх..."
          className="pl-9 rounded-xl bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
        />
      </div>

      {/* Content */}
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
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <BookOpen size={24} className="text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-medium text-foreground/70">Бичлэг олдсонгүй</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? 'Өөр үгээр хайж үзнэ үү' : 'Эхний бичлэгээ үүсгэнэ үү'}
            </p>
          </div>
          {!search && (
            <Link href="/home">
              <Button size="sm" variant="outline" className="rounded-xl">
                Бичлэг үүсгэх →
              </Button>
            </Link>
          )}
        </div>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1 || loading}
            className="rounded-xl gap-1"
          >
            Өмнөх
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages || loading}
            className="rounded-xl gap-1"
          >
            Дараах
          </Button>
        </div>
      )}
    </div>
  );
}
