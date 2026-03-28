import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryCard } from '@/components/categories/category-card';
import { localizeCategory } from '@/lib/utils/localize';
import type { Locale } from '@/i18n/config';
import type { Category } from '@/lib/types/database';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'category' });

  return {
    title: t('allCategories'),
  };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'category' });

  const supabase = await createClient();

  // Fetch categories with recipe counts
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name_en', { ascending: true });

  // Get recipe counts for each category
  const categories = await Promise.all(
    (categoriesData as Category[] || []).map(async (category) => {
      const { count } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_published', true);

      return {
        ...localizeCategory(category, locale as Locale),
        recipeCount: count || 0,
      };
    })
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
                {t('allCategories')}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {locale === 'fr'
                  ? 'Parcourez nos recettes par catégorie'
                  : 'Browse our recipes by category'}
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  recipeCount={category.recipeCount}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
