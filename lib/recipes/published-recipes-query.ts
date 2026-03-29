import type { SupabaseClient } from '@supabase/supabase-js';
import type { Category, Recipe } from '@/lib/types/database';

export const RECIPES_PAGE_SIZE = 12;

const RECIPE_LIST_SELECT = '*, category:categories(*)';

/** Escape `%` and `_` for PostgreSQL ILIKE; trim and cap length. */
function searchTermForIlike(raw: string): string | null {
  const trimmed = raw.trim().slice(0, 100);
  if (!trimmed) return null;
  return trimmed.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

/** PostgREST `.or()` filter for case-insensitive search across recipe fields. */
export function recipeSearchOrFilter(q: string): string | null {
  const term = searchTermForIlike(q);
  if (!term) return null;
  const pattern = `%${term}%`;
  const cols = ['title_en', 'description_en', 'slug_en'] as const;
  return cols.map((col) => `${col}.ilike.${pattern}`).join(',');
}

export type PublishedRecipesPageResult = {
  data: (Recipe & { category: Category | null })[] | null;
  error: { message: string } | null;
  count: number;
  hasMore: boolean;
};

export async function fetchPublishedRecipesPage(
  client: SupabaseClient,
  options: {
    page: number;
    pageSize: number;
    q?: string | null;
  }
): Promise<PublishedRecipesPageResult> {
  const { page, pageSize, q } = options;
  const pageSafe = Math.max(1, page);
  const sizeSafe = Math.min(50, Math.max(1, pageSize));
  const from = (pageSafe - 1) * sizeSafe;
  const to = from + sizeSafe - 1;

  let query = client
    .from('recipes')
    .select(RECIPE_LIST_SELECT, { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const orFilter = q ? recipeSearchOrFilter(q) : null;
  if (orFilter) {
    query = query.or(orFilter);
  }

  const { data, error, count } = await query.range(from, to);

  const total = count ?? 0;
  const loaded = data?.length ?? 0;
  const hasMore = from + loaded < total;

  return {
    data: data as (Recipe & { category: Category | null })[] | null,
    error: error ? { message: error.message } : null,
    count: total,
    hasMore,
  };
}
