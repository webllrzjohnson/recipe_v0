import type { LocalizedRecipe } from '@/lib/types/database';

const PLACEHOLDER_RECIPE_IMAGE =
  'https://placehold.co/1200x630/C0392B/FFFFFF?text=Recipe';

function isoDurationMinutes(min: number | null | undefined): string | undefined {
  if (min == null || min <= 0) return undefined;
  return `PT${Math.round(min)}M`;
}

function ingredientLinesForSchema(ingredients: string[]): string[] {
  return ingredients
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/^##\s/.test(line));
}

export function RecipeJsonLd({
  recipe,
  url,
}: {
  recipe: LocalizedRecipe;
  url: string;
}) {
  const imageUrl = recipe.image_url?.trim() || PLACEHOLDER_RECIPE_IMAGE;
  const ingredients = ingredientLinesForSchema(recipe.ingredients);
  const steps = recipe.instructions
    .map((text, i) => ({
      '@type': 'HowToStep' as const,
      position: i + 1,
      text: text.trim(),
    }))
    .filter((s) => s.text.length > 0);

  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description?.trim() || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    url,
  };

  const prep = isoDurationMinutes(recipe.prep_time);
  const cook = isoDurationMinutes(recipe.cook_time);
  if (prep) payload.prepTime = prep;
  if (cook) payload.cookTime = cook;

  if (recipe.servings != null && recipe.servings > 0) {
    payload.recipeYield = String(recipe.servings);
  }

  if (ingredients.length) payload.recipeIngredient = ingredients;

  if (steps.length) {
    payload.recipeInstructions = steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.position,
      text: s.text,
    }));
  }

  const json = JSON.stringify(
    JSON.parse(JSON.stringify(payload)) as Record<string, unknown>
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
