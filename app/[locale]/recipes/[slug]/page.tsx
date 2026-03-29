import { notFound } from 'next/navigation';
import Image from 'next/image';
import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { localizeRecipe } from '@/lib/utils/localize';
import { RecipePrintButton } from '@/components/recipes/recipe-print-button';
import { RecipeShareMenu } from '@/components/recipes/recipe-share-menu';
import { RecipeBlog } from '@/components/recipes/recipe-blog';
import { ArrowLeft } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Recipe, Category } from '@/lib/types/database';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { recipeAlternatePathnames } from '@/lib/seo/entity-paths';
import { RecipeJsonLd } from '@/components/seo/recipe-json-ld';
import {
  fetchPublishedRecipeByUrlSlug,
  normalizeUrlSlug,
} from '@/lib/supabase/fetch-by-url-slug';

export const dynamic = 'force-dynamic';

const OG_FALLBACK_RECIPE_IMAGE =
  'https://placehold.co/1200x630/C0392B/FFFFFF?text=Recipe';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug: rawSlug } = await params;
  const slug = normalizeUrlSlug(rawSlug);
  const supabase = createAnonServerClient();
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const { data: recipe, error } = await fetchPublishedRecipeByUrlSlug(
    supabase,
    slug
  );

  if (error && process.env.NODE_ENV === 'development') {
    console.error('[recipe metadata]', error.message);
  }

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title = locale === 'fr' ? recipe.title_fr : recipe.title_en;
  const description = locale === 'fr' ? recipe.description_fr : recipe.description_en;
  const ogImage = recipe.image_url?.trim() || OG_FALLBACK_RECIPE_IMAGE;

  return buildPageMetadata({
    locale,
    pathname: `/recipes/${slug}`,
    title,
    description,
    ogImages: [ogImage],
    ogType: 'article',
    siteName: tCommon('siteName'),
    alternatePathnames: recipeAlternatePathnames(recipe),
  });
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug: rawSlug } = await params;
  const slug = normalizeUrlSlug(rawSlug);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'recipe' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const supabase = createAnonServerClient();

  const { data: recipeData, error: recipeError } =
    await fetchPublishedRecipeByUrlSlug(supabase, slug);

  if (recipeError && process.env.NODE_ENV === 'development') {
    console.error('[recipe detail]', recipeError.message);
  }

  if (!recipeData) {
    notFound();
  }

  const recipe = localizeRecipe(
    recipeData as Recipe & { category: Category },
    locale as Locale
  );

  const { data: relatedData, error: relatedError } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .eq('category_id', recipeData.category_id)
    .neq('id', recipeData.id)
    .limit(3);

  if (relatedError && process.env.NODE_ENV === 'development') {
    console.error('[related recipes]', relatedError.message);
  }

  const relatedRecipes = (relatedData as (Recipe & { category: Category })[] || []).map(
    (r) => localizeRecipe(r, locale as Locale)
  );

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  const headersList = await headers();
  const host = headersList.get('host') ?? headersList.get('x-forwarded-host') ?? '';
  const protocol =
    headersList.get('x-forwarded-proto') ??
    (process.env.NODE_ENV === 'development' ? 'http' : 'https');
  const origin = host ? `${protocol}://${host}` : '';
  const recipePath = `/${locale}/recipes/${slug}`;
  const absUrl = origin ? `${origin}${recipePath}` : recipePath;
  const mailtoHref = `mailto:?subject=${encodeURIComponent(recipe.title)}&body=${encodeURIComponent(`${recipe.title}\n${absUrl}\n`)}`;

  return (
    <div className="flex min-h-screen flex-col">
      <RecipeJsonLd recipe={recipe} url={absUrl} />
      <Header />
      <main className="flex-1">
        <article className="recipe-editorial-page py-10 sm:py-14">
          <div className="mx-auto max-w-[730px] px-4 sm:px-6 lg:px-8">
            <Link
              href="/recipes"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {tCommon('backToRecipes')}
            </Link>

            <header className="mb-8 text-center sm:text-left">
              {recipe.category && (
                <Link href={`/categories/${recipe.category.slug}`}>
                  <Badge variant="secondary" className="mb-4">
                    {recipe.category.name}
                  </Badge>
                </Link>
              )}
              <h1 className="font-serif text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {recipe.title}
              </h1>
            </header>

            <RecipeBlog html={recipe.blog} heading={t('storyHeading')} />

            <div className="oc-recipe-container overflow-hidden">
              <header className="oc-recipe-header space-y-5 px-4 pb-2 pt-6 text-center sm:space-y-6 sm:px-8 sm:pt-8">
                <div className="mx-auto w-full max-w-md">
                  <div className="relative aspect-square overflow-hidden rounded-sm border border-[#666666]/40 bg-white dark:border-neutral-600/50 dark:bg-muted">
                    <Image
                      src={
                        recipe.image_url ||
                        'https://placehold.co/750x750/C0392B/FFFFFF?text=Recipe'
                      }
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 448px"
                      priority
                      loading="eager"
                    />
                  </div>
                </div>

                <h2 className="text-[1.65rem] sm:text-3xl lg:text-[2rem]">
                  {recipe.title}
                </h2>

                {recipe.description ? (
                  <div className="oc-recipe-summary mx-auto max-w-2xl whitespace-pre-line text-center font-sans">
                    {recipe.description}
                  </div>
                ) : null}

                <div className="oc-recipe-info flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-2 font-sans text-[0.9375rem]">
                  {recipe.prep_time != null && recipe.prep_time > 0 && (
                    <span>
                      <span className="oc-recipe-meta-label">{t('metaPrep')}</span>{' '}
                      <span className="font-semibold tabular-nums text-foreground">
                        {recipe.prep_time} {t('minutes')}
                      </span>
                    </span>
                  )}
                  {recipe.cook_time != null && recipe.cook_time > 0 && (
                    <span>
                      <span className="oc-recipe-meta-label">{t('metaCook')}</span>{' '}
                      <span className="font-semibold tabular-nums text-foreground">
                        {recipe.cook_time} {t('minutes')}
                      </span>
                    </span>
                  )}
                  {totalTime > 0 && (
                    <span>
                      <span className="oc-recipe-meta-label">{t('totalTime')}:</span>{' '}
                      <span className="font-semibold tabular-nums text-foreground">
                        {totalTime} {t('minutes')}
                      </span>
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span>
                      <span className="oc-recipe-meta-label">{t('difficulty')}:</span>{' '}
                      <span className="font-semibold text-foreground">{t(recipe.difficulty)}</span>
                    </span>
                  )}
                </div>

                <div className="border-b border-[#474747]/15 pb-6 dark:border-border">
                  <div className="oc-recipe-actions flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                    <RecipePrintButton />
                    <RecipeShareMenu
                      url={absUrl}
                      title={recipe.title}
                      description={recipe.description}
                    />
                    <a
                      href={mailtoHref}
                      className="underline underline-offset-4 decoration-[#474747]/35 hover:decoration-primary dark:decoration-muted-foreground/50"
                    >
                      {t('emailRecipe')}
                    </a>
                  </div>
                </div>
              </header>

              <section className="oc-recipe-content space-y-11 px-4 py-8 sm:space-y-12 sm:px-8 sm:pb-11">
                <div className="wprm-recipe-ingredients-wrap">
                  <h3 className="oc-recipe-section-title text-left">{t('ingredients')}</h3>
                  <ul className="oc-recipe-prose space-y-3 font-sans">
                    {recipe.ingredients.map((ingredient, index) => {
                      const section = ingredient.match(/^##\s+(.+)$/);
                      if (section) {
                        return (
                          <li key={index} className="list-none pt-2 first:pt-0">
                            <h4 className="oc-recipe-ingredient-group-title text-left">
                              {section[1]}
                            </h4>
                          </li>
                        );
                      }
                      const id = `recipe-ing-${recipe.id}-${index}`;
                      return (
                        <li
                          key={index}
                          className="flex list-none items-start gap-3 text-left"
                        >
                          <input
                            id={id}
                            type="checkbox"
                            className="mt-1.5 h-4 w-4 shrink-0 rounded border-input accent-primary"
                          />
                          <label
                            htmlFor={id}
                            className="cursor-pointer select-none font-medium text-[#2c2c2c] dark:text-foreground"
                          >
                            {ingredient}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="wprm-recipe-instructions-wrap">
                  <h3 className="oc-recipe-section-title text-left">{t('instructions')}</h3>
                  <ol className="oc-recipe-instruction-list oc-recipe-prose space-y-6 text-left font-sans">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="oc-recipe-step-num mt-[3px]">{index + 1}</span>
                        <p className="m-0 min-w-0 flex-1 font-normal leading-[25px] text-foreground">
                          {instruction}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {recipe.notes?.trim() ? (
                  <div className="wprm-recipe-notes-wrap border-t border-[#535e50]/12 pt-9 dark:border-border">
                    <h3 className="oc-recipe-section-title text-left">{t('notes')}</h3>
                    <div className="oc-recipe-prose whitespace-pre-line text-left font-sans">
                      {recipe.notes.trim()}
                    </div>
                  </div>
                ) : null}

                {recipe.nutrition.length > 0 ? (
                  <div className="wprm-nutrition-label-shortcode-container border-t border-[#535e50]/12 pt-9 dark:border-border">
                    <h3 className="oc-recipe-section-title text-left">
                      {t('nutritionInformation')}
                    </h3>
                    <div className="oc-recipe-prose flex flex-wrap gap-x-3 gap-y-2 text-left font-sans">
                      {recipe.nutrition.map((line, index) => {
                        const match = line.match(/^([^:]+:)\s*(.+)$/);
                        return (
                          <span key={index} className="max-w-full">
                            {match ? (
                              <>
                                <span className="oc-recipe-meta-label">{match[1]} </span>
                                <span className="text-[#2e2e2e] dark:text-foreground">{match[2]}</span>
                              </>
                            ) : (
                              <span className="text-foreground">{line}</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </article>

        {relatedRecipes.length > 0 && (
          <section className="border-t border-border bg-secondary/30 py-12 print:hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t('relatedRecipes')}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedRecipes.map((relatedRecipe) => (
                  <RecipeCard key={relatedRecipe.id} recipe={relatedRecipe} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
