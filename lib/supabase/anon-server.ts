import { createClient } from '@supabase/supabase-js';

/**
 * Anonymous Supabase client — no browser session / cookies.
 * Use for public reads (recipes, blog, categories) so visitor auth state
 * cannot break RLS or PostgREST behavior. Admin routes should keep using
 * `createClient()` from `@/lib/supabase/server`.
 */
export function createAnonServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required');
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
