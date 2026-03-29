import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import {
  fetchCategoryByUrlSlug,
  normalizeUrlSlug,
} from '@/lib/supabase/fetch-by-url-slug';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Link } from '@/i18n/navigation';
import { localizeCategory, localizeRecipe } from '@/lib/utils/localize';
import { ArrowLeft } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Category, Recipe } from '@/lib/types/database';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { categoryAlternatePathnames } from '@/lib/seo/entity-paths';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug: rawSlug } = await params;
  const slug = normalizeUrlSlug(rawSlug);
  const supabase = createAnonServerClient();
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const tSeo = await getTranslations({ locale, namespace: 'seo' });

  const { data: category, error: metaErr } = await fetchCategoryByUrlSlug(
    supabase,
    slug
  );

  if (metaErr && process.env.NODE_ENV === 'development') {
    console.error('[category metadata]', metaErr.message);
  }

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    };
  }

  const name = locale === 'fr' ? category.name_fr : category.name_en;
  const rawDescription =
    (locale === 'fr' ? category.description_fr : category.description_en)?.trim() ||
    null;
  const description =
    rawDescription ?? tSeo('categoryPageDescriptionFallback', { name });

  const ogImages = category.image_url?.trim()
    ? [category.image_url.trim()]
    : undefined;

  return buildPageMetadata({
    locale,
    pathname: `/categories/${slug}`,
    title: name,
    description,
    ogImages,
    siteName: tCommon('siteName'),
    alternatePathnames: categoryAlternatePathnames(category),
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug: rawSlug } = await params;
  const slug = normalizeUrlSlug(rawSlug);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'category' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const supabase = createAnonServerClient();

  const { data: categoryData, error: catErr } = await fetchCategoryByUrlSlug(
    supabase,
    slug
  );

  if (catErr && process.env.NODE_ENV === 'development') {
    console.error('[category detail]', catErr.message);
  }

  if (!categoryData) {
    notFound();
  }

  const category = localizeCategory(categoryData as Category, locale as Locale);

  // Fetch recipes in this category
  const { data: recipesData, error: recipesError } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('category_id', categoryData.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (recipesError && process.env.NODE_ENV === 'development') {
    console.error('[category recipes]', recipesError.message);
  }

  const recipes = (recipesData as (Recipe & { category: Category })[] || []).map(
    (recipe) => localizeRecipe(recipe, locale as Locale)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href="/categories"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {tCommon('backToCategories')}
            </Link>

            {/* Header */}
            <div className="mb-12">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-3 text-muted-foreground">{category.description}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {t('recipeCount', { count: recipes.length })}
              </p>
            </div>

            {/* Recipe Grid */}
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
                <p className="text-muted-foreground">{tCommon('noResults')}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
