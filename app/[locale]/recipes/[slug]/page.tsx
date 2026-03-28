import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { localizeRecipe } from '@/lib/utils/localize';
import { Clock, Users, ChefHat, ArrowLeft } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Recipe, Category } from '@/lib/types/database';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!recipe) {
    return { title: 'Recipe Not Found' };
  }

  const title = locale === 'fr' ? recipe.title_fr : recipe.title_en;
  const description = locale === 'fr' ? recipe.description_fr : recipe.description_en;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: recipe.image_url ? [recipe.image_url] : [],
    },
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'recipe' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const supabase = await createClient();

  const { data: recipeData } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!recipeData) {
    notFound();
  }

  const recipe = localizeRecipe(
    recipeData as Recipe & { category: Category },
    locale as Locale
  );

  // Fetch related recipes from same category
  const { data: relatedData } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .eq('category_id', recipeData.category_id)
    .neq('id', recipeData.id)
    .limit(3);

  const relatedRecipes = (relatedData as (Recipe & { category: Category })[] || []).map(
    (r) => localizeRecipe(r, locale as Locale)
  );

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="py-8 sm:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href="/recipes"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {tCommon('backToRecipes')}
            </Link>

            {/* Header */}
            <header className="mb-8">
              {recipe.category && (
                <Link href={`/categories/${recipe.category.slug}`}>
                  <Badge variant="secondary" className="mb-4">
                    {recipe.category.name}
                  </Badge>
                </Link>
              )}
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {recipe.description}
                </p>
              )}
            </header>

            {/* Image */}
            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src={recipe.image_url || 'https://placehold.co/1200x750/C0392B/FFFFFF?text=Recipe'}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Meta Info */}
            <div className="mb-8 flex flex-wrap gap-6 rounded-lg bg-secondary/50 p-4">
              {recipe.prep_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('prepTime')}</p>
                    <p className="font-medium">{recipe.prep_time} {t('minutes')}</p>
                  </div>
                </div>
              )}
              {recipe.cook_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('cookTime')}</p>
                    <p className="font-medium">{recipe.cook_time} {t('minutes')}</p>
                  </div>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('totalTime')}</p>
                    <p className="font-medium">{totalTime} {t('minutes')}</p>
                  </div>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('servings')}</p>
                    <p className="font-medium">{recipe.servings}</p>
                  </div>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('difficulty')}</p>
                    <p className="font-medium">{t(recipe.difficulty)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Ingredients */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
                    {t('ingredients')}
                  </h2>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructions */}
              <div className="lg:col-span-2">
                <h2 className="mb-6 font-serif text-xl font-semibold text-foreground">
                  {t('instructions')}
                </h2>
                <ol className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="mt-1 text-foreground">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </article>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <section className="border-t border-border bg-secondary/30 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 font-serif text-2xl font-semibold text-foreground">
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
