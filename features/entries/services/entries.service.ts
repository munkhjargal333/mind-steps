// ─────────────────────────────────────────────────────────────────────────────
// features/entries/services/entries.service.ts
// Feature-specific service for entries
// Re-exports from lib/services/journal.service.ts for feature encapsulation
// ─────────────────────────────────────────────────────────────────────────────

export {
  listEntries,
  getEntry,
  deleteEntry,
  createEntry,
} from '@/features/entries/services/entries.service';

export type {
  JournalEntry,
  PaginatedEntries,
} from '@/types';
