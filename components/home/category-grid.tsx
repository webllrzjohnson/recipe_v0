import { copy } from '@/lib/copy';
import { CategoryCard } from '@/components/categories/category-card';
import type { LocalizedCategory } from '@/lib/types/database';

const home = copy.home;

interface CategoryGridProps {
  categories: LocalizedCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {home.browseCategories}
          </h2>
          <p className="mt-3 text-muted-foreground">{home.categoriesDescription}</p>
        </div>

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
