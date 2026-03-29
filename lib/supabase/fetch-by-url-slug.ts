import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { Category, Recipe } from '@/lib/types/database';

const recipeSelectPublished = '*, category:categories(*)';

/** Match DB slugs to URL segments (encoding, stray whitespace). */
export function normalizeUrlSlug(raw: string): string {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) return trimmed;
  try {
    return decodeURIComponent(trimmed).trim();
  } catch {
    return trimmed;
  }
}

export async function fetchPublishedRecipeByUrlSlug(
  client: SupabaseClient,
  urlSlug: string
): Promise<{
  data: (Recipe & { category: Category | null }) | null;
  error: PostgrestError | null;
}> {
  const slug = normalizeUrlSlug(urlSlug);
  if (!slug) {
    return { data: null, error: null };
  }

  const q = () =>
    client.from('recipes').select(recipeSelectPublished).eq('is_published', true);

  let res = await q().eq('slug_en', slug).maybeSingle();
  if (res.error) return { data: null, error: res.error };
  if (res.data) {
    return {
      data: res.data as Recipe & { category: Category | null },
      error: null,
    };
  }

  res = await q().eq('slug_fr', slug).maybeSingle();
  if (res.error) return { data: null, error: res.error };
  return {
    data: (res.data ?? null) as (Recipe & { category: Category | null }) | null,
    error: null,
  };
}

export async function fetchCategoryByUrlSlug(
  client: SupabaseClient,
  urlSlug: string
): Promise<{ data: Category | null; error: PostgrestError | null }> {
  const slug = normalizeUrlSlug(urlSlug);
  if (!slug) {
    return { data: null, error: null };
  }

  let res = await client.from('categories').select('*').eq('slug_en', slug).maybeSingle();
  if (res.error) return { data: null, error: res.error };
  if (res.data) return { data: res.data as Category, error: null };

  res = await client.from('categories').select('*').eq('slug_fr', slug).maybeSingle();
  if (res.error) return { data: null, error: res.error };
  return { data: (res.data ?? null) as Category | null, error: null };
}
