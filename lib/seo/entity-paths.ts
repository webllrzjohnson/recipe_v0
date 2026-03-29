import type { Locale } from '@/i18n/config';
import type { Category, Recipe } from '@/lib/types/database';

export function recipeAlternatePathnames(
  recipe: Pick<Recipe, 'slug_en' | 'slug_fr'>
): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  const en = recipe.slug_en?.trim();
  const fr = recipe.slug_fr?.trim();
  if (en) out.en = `/recipes/${en}`;
  if (fr) out.fr = `/recipes/${fr}`;
  return out;
}

export function categoryAlternatePathnames(
  category: Pick<Category, 'slug_en' | 'slug_fr'>
): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  const en = category.slug_en?.trim();
  const fr = category.slug_fr?.trim();
  if (en) out.en = `/categories/${en}`;
  if (fr) out.fr = `/categories/${fr}`;
  return out;
}
