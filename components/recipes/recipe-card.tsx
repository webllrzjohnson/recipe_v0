import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Clock, Users, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LocalizedRecipe } from '@/lib/types/database';

interface RecipeCardProps {
  recipe: LocalizedRecipe;
  /** First visible cards on listing pages — improves LCP (implies eager load). */
  priority?: boolean;
}

export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  const t = useTranslations('recipe');

  const totalTime =
    (recipe.prep_time || 0) + (recipe.cook_time || 0);

  const difficultyLabel = recipe.difficulty
    ? t(recipe.difficulty)
    : null;

  return (
    <Link href={`/recipes/${recipe.slug}`} prefetch>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={recipe.image_url || 'https://placehold.co/800x600/C0392B/FFFFFF?text=Recipe'}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            loading={priority ? 'eager' : undefined}
          />
          {recipe.is_featured && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          {recipe.category && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">
              {recipe.category.name}
            </p>
          )}

          {/* Title */}
          <h3 className="mb-2 font-serif text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          {/* Description */}
          {recipe.description && (
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {totalTime} {t('minutes')}
                </span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{recipe.servings}</span>
              </div>
            )}
            {difficultyLabel && (
              <div className="flex items-center gap-1">
                <ChefHat className="h-3.5 w-3.5" />
                <span>{difficultyLabel}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
