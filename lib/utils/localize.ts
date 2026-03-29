import type { Locale } from '@/i18n/config';
import type {
  Category,
  Recipe,
  BlogPost,
  LocalizedCategory,
  LocalizedRecipe,
  LocalizedBlogPost,
} from '@/lib/types/database';

function jsonbStringArray(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === 'string') {
    try {
      return jsonbStringArray(JSON.parse(value));
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

/** Use primary locale; if empty, fall back so notes/nutrition still show when only one language is filled. */
function pickNotes(
  locale: Locale,
  recipe: Recipe
): string | null {
  const en = recipe.notes_en?.trim() || null;
  const fr = recipe.notes_fr?.trim() || null;
  if (locale === 'fr') return fr ?? en;
  return en ?? fr;
}

function pickNutrition(locale: Locale, recipe: Recipe): string[] {
  const en = jsonbStringArray(recipe.nutrition_en);
  const fr = jsonbStringArray(recipe.nutrition_fr);
  if (locale === 'fr') return fr.length > 0 ? fr : en;
  return en.length > 0 ? en : fr;
}

function pickBlog(locale: Locale, recipe: Recipe): string | null {
  const en = recipe.blog_en?.trim() || null;
  const fr = recipe.blog_fr?.trim() || null;
  if (locale === 'fr') return fr ?? en;
  return en ?? fr;
}

export function localizeCategory(
  category: Category,
  locale: Locale
): LocalizedCategory {
  const slugFr = category.slug_fr?.trim();
  return {
    id: category.id,
    name: locale === 'fr' ? category.name_fr : category.name_en,
    slug:
      locale === 'fr'
        ? slugFr || category.slug_en
        : category.slug_en,
    description:
      locale === 'fr' ? category.description_fr : category.description_en,
    image_url: category.image_url,
  };
}

export function localizeRecipe(recipe: Recipe, locale: Locale): LocalizedRecipe {
  const slugFr = recipe.slug_fr?.trim();
  return {
    id: recipe.id,
    title: locale === 'fr' ? recipe.title_fr : recipe.title_en,
    slug: locale === 'fr' ? slugFr || recipe.slug_en : recipe.slug_en,
    description:
      locale === 'fr' ? recipe.description_fr : recipe.description_en,
    ingredients:
      locale === 'fr' ? recipe.ingredients_fr : recipe.ingredients_en,
    instructions:
      locale === 'fr' ? recipe.instructions_fr : recipe.instructions_en,
    notes: pickNotes(locale, recipe),
    blog: pickBlog(locale, recipe),
    nutrition: pickNutrition(locale, recipe),
    prep_time: recipe.prep_time_minutes,
    cook_time: recipe.cook_time_minutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    image_url: recipe.image_url,
    is_featured: recipe.is_featured,
    category: recipe.category
      ? localizeCategory(recipe.category, locale)
      : undefined,
  };
}

export function localizeBlogPost(
  post: BlogPost,
  locale: Locale
): LocalizedBlogPost {
  return {
    id: post.id,
    title: locale === 'fr' ? post.title_fr : post.title_en,
    slug: post.slug,
    content: locale === 'fr' ? post.content_fr : post.content_en,
    excerpt: locale === 'fr' ? post.excerpt_fr : post.excerpt_en,
    image_url: post.image_url,
    created_at: post.created_at,
  };
}
