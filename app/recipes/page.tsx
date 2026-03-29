import { copy } from '@/lib/copy';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RecipesInfiniteList } from '@/components/recipes/recipes-infinite-list';
import { localizeRecipe } from '@/lib/utils/localize';
import type { Recipe, Category } from '@/lib/types/database';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { getSiteBrand } from '@/lib/site/get-site-appearance';
import {
  fetchPublishedRecipesPage,
  RECIPES_PAGE_SIZE,
} from '@/lib/recipes/published-recipes-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const common = copy.common;
const seo = copy.seo;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? '';
  const title = q ? `${common.recipes} · ${q}` : common.recipes;
  const { siteName } = await getSiteBrand();

  return buildPageMetadata({
    pathname: '/recipes',
    title,
    description: seo.recipesListingDescription,
    siteName,
  });
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? '';

  const supabase = createAnonServerClient();

  const [{ data, error, count, hasMore }, { siteName, siteTagline }] =
    await Promise.all([
      fetchPublishedRecipesPage(supabase, {
        page: 1,
        pageSize: RECIPES_PAGE_SIZE,
        q: q || null,
      }),
      getSiteBrand(),
    ]);

  if (error && process.env.NODE_ENV === 'development') {
    console.error('[recipes page]', error.message);
  }

  const rows = (data ?? []) as (Recipe & { category: Category | null })[];
  const recipes = rows.map((recipe) => localizeRecipe(recipe));

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} siteTagline={siteTagline} />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {common.recipes}
              </h1>
              <p className="mt-3 text-muted-foreground">{seo.recipesPageIntro}</p>
            </div>

            <form
              method="get"
              className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder={common.searchRecipesPlaceholder}
                  className="pl-9"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" variant="secondary" className="shrink-0">
                {common.search}
              </Button>
            </form>

            <RecipesInfiniteList
              initialRecipes={recipes}
              initialHasMore={hasMore}
              searchQuery={q}
              totalCount={count}
            />
          </div>
        </section>
      </main>
      <Footer siteName={siteName} siteTagline={siteTagline} />
    </div>
  );
}
