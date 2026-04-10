// ─────────────────────────────────────────────────────────────────────────────
// features/entries/hooks/useEntries.ts
// Feature hook for journal entries list + single entry.
// Uses feature-local service instead of lib/services
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { JournalEntry, PaginatedEntries } from '../types';
import {
  listEntries,
  getEntry,
  deleteEntry,
} from '../services/entries.service';

// ─── useEntries (paginated list) ──────────────────────────────────────────────

interface UseEntriesOptions {
  initialPage?: number;
  pageSize?: number;
}

export function useEntries({
  initialPage = 1,
  pageSize = 5,
}: UseEntriesOptions = {}) {
  const [data, setData] = useState<PaginatedEntries | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState('');

  const fetchPage = useCallback(
    async (p: number, s: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await listEntries({
          page: p,
          page_size: pageSize,
          search: s || undefined,
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchPage(page, search);
  }, [fetchPage, page, search]);

  const refresh = () => fetchPage(page, search);

  const remove = async (entryId: string) => {
    await deleteEntry(entryId);
    await fetchPage(page, search);
  };

  return {
    entries: data?.items ?? [],
    total: data?.total ?? 0,
    page,
    pageSize,
    loading,
    error,
    search,
    setSearch: (s: string) => {
      setSearch(s);
      setPage(1);
    },
    setPage,
    refresh,
    remove,
  } as const;
}

// ─── useEntry (single entry) ──────────────────────────────────────────────────

export function useEntry(entryId: string | null) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entryId) return;
    setLoading(true);
    setError(null);
    getEntry(entryId)
      .then(setEntry)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Алдаа гарлаа')
      )
      .finally(() => setLoading(false));
  }, [entryId]);

  return { entry, loading, error } as const;
}
