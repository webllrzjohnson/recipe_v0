import Link from 'next/link';
import { copy } from '@/lib/copy';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { LocalizedRecipe } from '@/lib/types/database';

const home = copy.home;
const common = copy.common;

interface FeaturedRecipesProps {
  recipes: LocalizedRecipe[];
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  if (recipes.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {home.featuredRecipes}
          </h2>
          <p className="mt-3 text-muted-foreground">{home.featuredDescription}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              priority={index < 3}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/recipes">
              {common.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
