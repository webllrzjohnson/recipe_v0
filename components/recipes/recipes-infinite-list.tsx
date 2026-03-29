'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { RECIPES_PAGE_SIZE } from '@/lib/recipes/published-recipes-query';
import type { LocalizedRecipe } from '@/lib/types/database';
import type { Locale } from '@/i18n/config';

type ApiPayload = {
  recipes: LocalizedRecipe[];
  page: number;
  hasMore: boolean;
  total: number;
};

export function RecipesInfiniteList({
  locale,
  initialRecipes,
  initialHasMore,
  searchQuery,
  totalCount,
}: {
  locale: Locale;
  initialRecipes: LocalizedRecipe[];
  initialHasMore: boolean;
  searchQuery: string;
  totalCount: number;
}) {
  const t = useTranslations('common');
  const [recipes, setRecipes] = useState<LocalizedRecipe[]>(initialRecipes);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setRecipes(initialRecipes);
    setPage(1);
    setHasMore(initialHasMore);
    setLoadError(null);
  }, [initialRecipes, initialHasMore, searchQuery]);

  const loadNext = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setLoadError(null);
    const nextPage = page + 1;
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(RECIPES_PAGE_SIZE),
      locale,
    });
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }

    try {
      const res = await fetch(`/api/recipes?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || t('error'));
      }
      const body = (await res.json()) as ApiPayload;
      setRecipes((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        const merged = [...prev];
        for (const r of body.recipes) {
          if (!seen.has(r.id)) {
            seen.add(r.id);
            merged.push(r);
          }
        }
        return merged;
      });
      setPage(nextPage);
      setHasMore(body.hasMore);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : t('error'));
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page, searchQuery, locale, t]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          void loadNext();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadNext]);

  if (recipes.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{t('noResults')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {totalCount > 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('recipeCountShowing', { count: totalCount })}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <div ref={sentinelRef} className="flex min-h-6 justify-center py-4" aria-hidden />

      {loadError ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void loadNext()}>
            {t('retry')}
          </Button>
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-2">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      ) : null}

      {hasMore && !loading && !loadError ? (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={() => void loadNext()}>
            {t('loadMore')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
