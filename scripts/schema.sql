-- Sarap Kitchen — full DDL for a new database (Supabase / Postgres).
-- Apply in order: schema.sql → rls.sql → seed.sql (optional).
-- Then run bootstrap_admin.sql once per admin user (see file header).

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug_en TEXT NOT NULL,
  slug_fr TEXT,
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipes
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug_en TEXT NOT NULL,
  slug_fr TEXT,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  blog_en TEXT,
  blog_fr TEXT,
  ingredients_en JSONB NOT NULL DEFAULT '[]',
  ingredients_fr JSONB NOT NULL DEFAULT '[]',
  instructions_en JSONB NOT NULL DEFAULT '[]',
  instructions_fr JSONB NOT NULL DEFAULT '[]',
  notes_en TEXT,
  notes_fr TEXT,
  nutrition_en JSONB NOT NULL DEFAULT '[]',
  nutrition_fr JSONB NOT NULL DEFAULT '[]',
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  excerpt_en TEXT,
  excerpt_fr TEXT,
  content_en TEXT,
  content_fr TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin profiles (auth.users FK)
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_recipes_category ON recipes(category_id);
CREATE INDEX idx_recipes_featured ON recipes(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_recipes_published ON recipes(is_published) WHERE is_published = TRUE;
ALTER TABLE categories ADD CONSTRAINT categories_slug_en_key UNIQUE (slug_en);
CREATE UNIQUE INDEX categories_slug_fr_unique ON categories (slug_fr)
  WHERE slug_fr IS NOT NULL AND length(trim(slug_fr)) > 0;
ALTER TABLE recipes ADD CONSTRAINT recipes_slug_en_key UNIQUE (slug_en);
CREATE UNIQUE INDEX recipes_slug_fr_unique ON recipes (slug_fr)
  WHERE slug_fr IS NOT NULL AND length(trim(slug_fr)) > 0;
CREATE INDEX idx_recipes_slug_en ON recipes(slug_en);
CREATE INDEX idx_recipes_slug_fr ON recipes(slug_fr) WHERE slug_fr IS NOT NULL;
CREATE INDEX idx_categories_slug_en ON categories(slug_en);
CREATE INDEX idx_categories_slug_fr ON categories(slug_fr) WHERE slug_fr IS NOT NULL;
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
