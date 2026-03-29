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

function pickNotes(recipe: Recipe): string | null {
  return recipe.notes_en?.trim() || null;
}

function pickNutrition(recipe: Recipe): string[] {
  return jsonbStringArray(recipe.nutrition_en);
}

function pickBlog(recipe: Recipe): string | null {
  return recipe.blog_en?.trim() || null;
}

export function localizeCategory(category: Category): LocalizedCategory {
  return {
    id: category.id,
    name: category.name_en,
    slug: category.slug_en,
    description: category.description_en,
    image_url: category.image_url,
  };
}

export function localizeRecipe(recipe: Recipe): LocalizedRecipe {
  const slugEn = recipe.slug_en?.trim() || '';
  return {
    id: recipe.id,
    title: recipe.title_en,
    slug: slugEn,
    description: recipe.description_en,
    ingredients: recipe.ingredients_en,
    instructions: recipe.instructions_en,
    notes: pickNotes(recipe),
    blog: pickBlog(recipe),
    nutrition: pickNutrition(recipe),
    prep_time: recipe.prep_time_minutes,
    cook_time: recipe.cook_time_minutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    image_url: recipe.image_url,
    is_featured: recipe.is_featured,
    category: recipe.category
      ? localizeCategory(recipe.category)
      : undefined,
  };
}

export function localizeBlogPost(post: BlogPost): LocalizedBlogPost {
  return {
    id: post.id,
    title: post.title_en?.trim() || '',
    slug: post.slug,
    content: post.content_en ?? null,
    excerpt: post.excerpt_en ?? null,
    image_url: post.image_url,
    created_at: post.created_at,
  };
}
