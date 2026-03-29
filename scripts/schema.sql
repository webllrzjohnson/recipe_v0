-- Sarap Kitchen — full DDL for a new database (Supabase / Postgres).
-- Fresh install (one file): scripts/install_fresh_database.sql → then bootstrap_admin.sql.
-- Or apply in order: this file → rls_and_storage.sql → seed.sql (optional).
-- Upgrading an older database missing tables: legacy_schema_patches.sql (after rls_and_storage.sql).
-- Dropping legacy French columns: drop_legacy_french_columns.sql
-- Existing site_settings without site_name: scripts/add_site_name_to_site_settings.sql
-- Redeploying the Next.js app only (same Supabase): do not re-run SQL.

-- Categories (English only)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug_en TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_en TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipes (English only)
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug_en TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_en TEXT,
  blog_en TEXT,
  ingredients_en JSONB NOT NULL DEFAULT '[]',
  instructions_en JSONB NOT NULL DEFAULT '[]',
  notes_en TEXT,
  nutrition_en JSONB NOT NULL DEFAULT '[]',
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

-- Blog posts (English only)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_en TEXT,
  content_en TEXT,
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
ALTER TABLE recipes ADD CONSTRAINT recipes_slug_en_key UNIQUE (slug_en);
CREATE INDEX idx_recipes_slug_en ON recipes(slug_en);
CREATE INDEX idx_categories_slug_en ON categories(slug_en);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Site-wide settings (singleton row id = 1). Public read; admins manage via RLS.
CREATE TABLE site_settings (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'Sarap Kitchen',
  site_tagline TEXT NOT NULL DEFAULT 'Delicious Filipino Recipes',
  color_scheme TEXT NOT NULL DEFAULT 'tomato_sage',
  font_pair TEXT NOT NULL DEFAULT 'baskerville_raleway',
  favicon_url TEXT,
  ads_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  adsense_publisher_id TEXT,
  adsense_placements JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (id, site_name, site_tagline, color_scheme, font_pair, ads_enabled, adsense_publisher_id, adsense_placements)
VALUES (1, 'Sarap Kitchen', 'Delicious Filipino Recipes', 'tomato_sage', 'baskerville_raleway', FALSE, NULL, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Editable static pages (home, about, legal, etc.). Public read; admins manage via RLS.
CREATE TABLE static_pages (
  page_slug TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (page_slug, locale)
);
