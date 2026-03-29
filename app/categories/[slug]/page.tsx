import { notFound } from 'next/navigation';
import Link from 'next/link';
import { copy } from '@/lib/copy';
import { formatCategoryRecipeCount } from '@/lib/format-copy';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import {
  fetchCategoryByUrlSlug,
  normalizeUrlSlug,
} from '@/lib/supabase/fetch-by-url-slug';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { localizeCategory, localizeRecipe } from '@/lib/utils/localize';
import { ArrowLeft } from 'lucide-react';
import type { Category, Recipe } from '@/lib/types/database';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { getSiteBrand } from '@/lib/site/get-site-appearance';

const common = copy.common;
const seo = copy.seo;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normalizeUrlSlug(rawSlug);
  const supabase = createAnonServerClient();

  const [{ data: category, error: metaErr }, { siteName }] = await Promise.all([
    fetchCategoryByUrlSlug(supabase, slug),
    getSiteBrand(),
  ]);

  if (metaErr && process.env.NODE_ENV === 'development') {
    console.error('[category metadata]', metaErr.message);
  }

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    };
  }

  const name = category.name_en;
  const rawDescription = category.description_en?.trim() || null;
  const description =
    rawDescription ??
    seo.categoryPageDescriptionFallback.replace('{name}', name);

  const ogImages = category.image_url?.trim()
    ? [category.image_url.trim()]
    : undefined;

  return buildPageMetadata({
    pathname: `/categories/${slug}`,
    title: name,
    description,
    ogImages,
    siteName,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normalizeUrlSlug(rawSlug);

  const supabase = createAnonServerClient();

  const [{ data: categoryData, error: catErr }, { siteName, siteTagline }] =
    await Promise.all([fetchCategoryByUrlSlug(supabase, slug), getSiteBrand()]);

  if (catErr && process.env.NODE_ENV === 'development') {
    console.error('[category detail]', catErr.message);
  }

  if (!categoryData) {
    notFound();
  }

  const category = localizeCategory(categoryData as Category);

  const { data: recipesData, error: recipesError } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('category_id', categoryData.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (recipesError && process.env.NODE_ENV === 'development') {
    console.error('[category recipes]', recipesError.message);
  }

  const recipes = (recipesData as (Recipe & { category: Category })[] | null)?.map(
    (recipe) => localizeRecipe(recipe)
  ) ?? [];

  const recipeCountLabel = formatCategoryRecipeCount(recipes.length);

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} siteTagline={siteTagline} />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/categories"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {common.backToCategories}
            </Link>

            <div className="mb-12">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-3 text-muted-foreground">{category.description}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">{recipeCountLabel}</p>
            </div>

            {recipes.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    priority={index < 3}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{common.noResults}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer siteName={siteName} siteTagline={siteTagline} />
    </div>
  );
}
