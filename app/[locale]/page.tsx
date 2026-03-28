import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedRecipes } from '@/components/home/featured-recipes';
import { CategoryGrid } from '@/components/home/category-grid';
import { localizeRecipe, localizeCategory } from '@/lib/utils/localize';
import type { Locale } from '@/i18n/config';
import type { Recipe, Category } from '@/lib/types/database';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('heroTitle'),
    description: t('heroSubtitle'),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // Fetch featured recipes
  const { data: recipesData } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name_en', { ascending: true });

  const recipes = (recipesData as (Recipe & { category: Category })[] || []).map(
    (recipe) => localizeRecipe(recipe, locale as Locale)
  );

  const categories = (categoriesData as Category[] || []).map((category) =>
    localizeCategory(category, locale as Locale)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedRecipes recipes={recipes} />
        <CategoryGrid categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
