import { NextRequest, NextResponse } from 'next/server';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import {
  fetchPublishedRecipesPage,
  RECIPES_PAGE_SIZE,
} from '@/lib/recipes/published-recipes-query';
import { localizeRecipe } from '@/lib/utils/localize';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get('limit') || String(RECIPES_PAGE_SIZE), 10) || RECIPES_PAGE_SIZE)
  );
  const q = (searchParams.get('q') || '').trim();

  try {
    const supabase = createAnonServerClient();
    const result = await fetchPublishedRecipesPage(supabase, {
      page,
      pageSize: limit,
      q: q || null,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    const recipes = (result.data ?? []).map((row) => localizeRecipe(row));

    return NextResponse.json({
      recipes,
      page,
      hasMore: result.hasMore,
      total: result.count,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
