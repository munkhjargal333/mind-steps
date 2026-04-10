// shared/lib/server/index.ts
// Re-export all server-only utilities.
// This barrel is marked server-only — importing it in a Client Component
// will produce a build error, which is intentional.

import 'server-only';

export { createClient as createSupabaseServer } from '@/lib/supabase/server';
