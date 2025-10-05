/**
 * @file supabase-client.ts
 * @description Initialize a global Supabase client for our project to use.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../../supabase-public.ts';

// Create a typed Supabase client instance
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
