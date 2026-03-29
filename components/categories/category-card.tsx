import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';
import type { LocalizedCategory } from '@/lib/types/database';

interface CategoryCardProps {
  category: LocalizedCategory;
  recipeCount?: number;
  /** First tiles on grids — improves LCP. */
  priority?: boolean;
}

export function CategoryCard({
  category,
  recipeCount,
  priority = false,
}: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} prefetch>
      <Card className="group relative h-48 overflow-hidden">
        {/* Background Image */}
        <Image
          src={category.image_url || 'https://placehold.co/800x600/C0392B/FFFFFF?text=Category'}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority={priority}
          loading={priority ? 'eager' : undefined}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
          <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">
            {category.name}
          </h3>
          {recipeCount !== undefined && (
            <p className="mt-1 text-sm text-white/80">
              {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
