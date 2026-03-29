import { createAnonServerClient } from '@/lib/supabase/anon-server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedRecipes } from '@/components/home/featured-recipes';
import { CategoryGrid } from '@/components/home/category-grid';
import { localizeRecipe, localizeCategory } from '@/lib/utils/localize';
import type { Recipe, Category } from '@/lib/types/database';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { getSiteBrand } from '@/lib/site/get-site-appearance';
import { resolveHomeHero } from '@/lib/static-pages/resolve';

export async function generateMetadata() {
  const supabase = createAnonServerClient();
  const [hero, { siteName }] = await Promise.all([
    resolveHomeHero(supabase),
    getSiteBrand(),
  ]);

  return buildPageMetadata({
    pathname: '',
    title: hero.heroTitle,
    description: hero.heroSubtitle,
    siteName,
  });
}

export default async function HomePage() {
  const supabase = createAnonServerClient();
  const [heroContent, { siteName, siteTagline }] = await Promise.all([
    resolveHomeHero(supabase),
    getSiteBrand(),
  ]);

  const { data: recipesData, error: recipesError } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (recipesError && process.env.NODE_ENV === 'development') {
    console.error('[home featured recipes]', recipesError.message);
  }

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name_en', { ascending: true });

  const recipes = (recipesData as (Recipe & { category: Category })[] | null)?.map(
    (recipe) => localizeRecipe(recipe)
  ) ?? [];

  const categories = (categoriesData as Category[] | null)?.map((category) =>
    localizeCategory(category)
  ) ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} siteTagline={siteTagline} />
      <main className="flex-1">
        <HeroSection content={heroContent} />
        <FeaturedRecipes recipes={recipes} />
        <CategoryGrid categories={categories} />
      </main>
      <Footer siteName={siteName} siteTagline={siteTagline} />
    </div>
  );
}
