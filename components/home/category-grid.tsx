import { useTranslations } from 'next-intl';
import { CategoryCard } from '@/components/categories/category-card';
import type { LocalizedCategory } from '@/lib/types/database';

interface CategoryGridProps {
  categories: LocalizedCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const t = useTranslations('home');

  if (categories.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t('browseCategories')}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t('categoriesDescription')}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
