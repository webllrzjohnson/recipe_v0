import type { Locale } from '@/i18n/config';
import type {
  Category,
  Recipe,
  BlogPost,
  LocalizedCategory,
  LocalizedRecipe,
  LocalizedBlogPost,
} from '@/lib/types/database';

export function localizeCategory(
  category: Category,
  locale: Locale
): LocalizedCategory {
  return {
    id: category.id,
    name: locale === 'fr' ? category.name_fr : category.name_en,
    slug: category.slug,
    description:
      locale === 'fr' ? category.description_fr : category.description_en,
    image_url: category.image_url,
  };
}

export function localizeRecipe(recipe: Recipe, locale: Locale): LocalizedRecipe {
  return {
    id: recipe.id,
    title: locale === 'fr' ? recipe.title_fr : recipe.title_en,
    slug: recipe.slug,
    description:
      locale === 'fr' ? recipe.description_fr : recipe.description_en,
    ingredients:
      locale === 'fr' ? recipe.ingredients_fr : recipe.ingredients_en,
    instructions:
      locale === 'fr' ? recipe.instructions_fr : recipe.instructions_en,
    prep_time: recipe.prep_time,
    cook_time: recipe.cook_time,
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
