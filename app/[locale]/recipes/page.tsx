import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { localizeRecipe } from '@/lib/utils/localize';
import type { Locale } from '@/i18n/config';
import type { Recipe, Category } from '@/lib/types/database';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('recipes'),
  };
}

export default async function RecipesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });

  const supabase = await createClient();

  const { data: recipesData } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const recipes = (recipesData as (Recipe & { category: Category })[] || []).map(
    (recipe) => localizeRecipe(recipe, locale as Locale)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {t('recipes')}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {locale === 'fr'
                  ? 'Découvrez notre collection de recettes délicieuses'
                  : 'Discover our collection of delicious recipes'}
              </p>
            </div>

            {/* Recipe Grid */}
            {recipes.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{t('noResults')}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
