// features/entries/services/entries.service.ts
// Re-exports API functions — services layer may add business logic here later

export {
  listEntries,
  getEntry,
  deleteEntry,
  createEntry,
} from '../api/entries.api';

export type { JournalEntry, PaginatedEntries } from '@/types';
