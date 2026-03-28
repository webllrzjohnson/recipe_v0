import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { LocalizedRecipe } from '@/lib/types/database';

interface FeaturedRecipesProps {
  recipes: LocalizedRecipe[];
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  if (recipes.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t('featuredRecipes')}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t('featuredDescription')}
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/recipes">
              {tCommon('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
