// ─────────────────────────────────────────────────────────────────────────────
// features/entries/index.ts
// Public API for entries feature
// ─────────────────────────────────────────────────────────────────────────────

export { useEntries, useEntry } from './hooks/useEntries';
export type { JournalEntry, PaginatedEntries } from './types';
export { listEntries, getEntry, deleteEntry, createEntry } from './services/entries.service';
