import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { Category, Recipe } from '@/lib/types/database';

const recipeSelectPublished = '*, category:categories(*)';

export async function fetchPublishedRecipeByUrlSlug(
  client: SupabaseClient,
  urlSlug: string
): Promise<{
  data: (Recipe & { category: Category | null }) | null;
  error: PostgrestError | null;
}> {
  const q = () =>
    client.from('recipes').select(recipeSelectPublished).eq('is_published', true);

  let res = await q().eq('slug_en', urlSlug).maybeSingle();
  if (res.error) return { data: null, error: res.error };
  if (res.data) {
    return {
      data: res.data as Recipe & { category: Category | null },
      error: null,
    };
  }

  res = await q().eq('slug_fr', urlSlug).maybeSingle();
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
  let res = await client.from('categories').select('*').eq('slug_en', urlSlug).maybeSingle();
  if (res.error) return { data: null, error: res.error };
  if (res.data) return { data: res.data as Category, error: null };

  res = await client.from('categories').select('*').eq('slug_fr', urlSlug).maybeSingle();
  if (res.error) return { data: null, error: res.error };
  return { data: (res.data ?? null) as Category | null, error: null };
}
