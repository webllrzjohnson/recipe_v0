import { copy } from '@/lib/copy';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryCard } from '@/components/categories/category-card';
import { localizeCategory } from '@/lib/utils/localize';
import type { Category } from '@/lib/types/database';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';

const common = copy.common;
const categoryNs = copy.category;
const seo = copy.seo;

export async function generateMetadata() {
  return buildPageMetadata({
    pathname: '/categories',
    title: categoryNs.allCategories,
    description: seo.categoriesListingDescription,
    siteName: common.siteName,
  });
}

export default async function CategoriesPage() {
  const supabase = createAnonServerClient();

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name_en', { ascending: true });

  const categories = await Promise.all(
    (categoriesData as Category[] | null)?.map(async (category) => {
      const { count } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_published', true);

      return {
        ...localizeCategory(category),
        recipeCount: count || 0,
      };
    }) ?? []
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {categoryNs.allCategories}
              </h1>
              <p className="mt-3 text-muted-foreground">{seo.categoriesPageIntro}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  recipeCount={category.recipeCount}
                  priority={index < 4}
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
