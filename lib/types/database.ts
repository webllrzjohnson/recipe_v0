export interface Category {
  id: string;
  name_en: string;
  slug_en: string;
  description_en: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title_en: string;
  slug_en: string;
  description_en: string | null;
  ingredients_en: string[];
  instructions_en: string[];
  notes_en: string | null;
  blog_en?: string | null;
  nutrition_en: string[];
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  image_url: string | null;
  category_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface BlogPost {
  id: string;
  title_en: string;
  slug: string;
  content_en: string | null;
  excerpt_en: string | null;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  display_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  site_tagline: string;
  color_scheme: string;
  font_pair: string;
  favicon_url: string | null;
  ads_enabled: boolean;
  adsense_publisher_id: string | null;
  adsense_placements: Record<string, unknown>;
  updated_at: string;
}

// Localized types for use in components
export interface LocalizedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export interface LocalizedRecipe {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  notes: string | null;
  blog: string | null;
  nutrition: string[];
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  image_url: string | null;
  is_featured: boolean;
  category?: LocalizedCategory;
}

export interface LocalizedBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}
