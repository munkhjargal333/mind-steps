// core/supabase/client.ts
// Core Supabase client instance

import { createClient } from '@supabase/supabase-js';
import type { SupabaseConfig } from './types';

const config: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

if (!config.url || !config.anonKey) {
  console.warn('Supabase credentials not configured');
}

export const supabaseClient = createClient(config.url, config.anonKey);
