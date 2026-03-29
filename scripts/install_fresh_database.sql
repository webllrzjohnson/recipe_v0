-- =============================================================================
-- Sarap Kitchen — one-shot install for a NEW empty Supabase (Postgres) project
-- =============================================================================
--
-- When do you run this?
--   • New database / new Supabase project: run this file ONCE in the SQL Editor.
--   • Redeploying only the Next.js site (teacher's/friend's server, Vercel, etc.):
--     you do NOT re-run SQL if the same Supabase project and data are unchanged.
--     Just set env vars (NEXT_PUBLIC_SUPABASE_URL, keys, etc.) and deploy.
--
-- After this file succeeds:
--   1. Authentication → create a user, then run scripts/bootstrap_admin.sql
--      (paste that user's UUID + email) so they can use /admin.
--   2. Optional demo content: run scripts/seed.sql (only on empty/fresh data — see seed header).
--
-- Upgrading an OLD database that predates site_settings/static_pages:
--   Prefer scripts/legacy_schema_patches.sql after rls.sql instead of a full reinstall,
--   then run scripts/storage.sql if you use CMS image uploads.
--
-- Modular copies (same logic, split for maintenance): schema.sql → rls.sql → storage.sql
-- =============================================================================

-- ---------- schema.sql (tables, indexes, seed row for site_settings) ----------

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

-- Site-wide settings (singleton row id = 1). Public read; admins manage via RLS.
CREATE TABLE site_settings (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  ads_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  adsense_publisher_id TEXT,
  adsense_placements JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (id, ads_enabled, adsense_publisher_id, adsense_placements)
VALUES (1, FALSE, NULL, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Editable static pages (home, about, legal, etc.). Public read; admins manage via RLS.
CREATE TABLE static_pages (
  page_slug TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (page_slug, locale)
);

-- ------------------------------- rls.sql ------------------------------------

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.auth_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT p.is_admin FROM public.admin_profiles AS p WHERE p.id = auth.uid()),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.auth_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_is_admin() TO authenticated, anon;

DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Public can view published recipes" ON recipes;
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can view all recipes" ON recipes;
DROP POLICY IF EXISTS "Admins can insert recipes" ON recipes;
DROP POLICY IF EXISTS "Admins can update recipes" ON recipes;
DROP POLICY IF EXISTS "Admins can delete recipes" ON recipes;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can view own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON admin_profiles;

CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published recipes" ON recipes FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins can manage categories" ON categories FOR ALL
  USING (public.auth_is_admin());

CREATE POLICY "Admins can view all recipes" ON recipes FOR SELECT
  USING (public.auth_is_admin());
CREATE POLICY "Admins can insert recipes" ON recipes FOR INSERT
  WITH CHECK (public.auth_is_admin());
CREATE POLICY "Admins can update recipes" ON recipes FOR UPDATE
  USING (public.auth_is_admin());
CREATE POLICY "Admins can delete recipes" ON recipes FOR DELETE
  USING (public.auth_is_admin());

CREATE POLICY "Admins can manage blog posts" ON blog_posts FOR ALL
  USING (public.auth_is_admin());

CREATE POLICY "Users can view own profile" ON admin_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON admin_profiles FOR SELECT
  USING (public.auth_is_admin());

DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL
  USING (public.auth_is_admin())
  WITH CHECK (public.auth_is_admin());

ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read static pages" ON static_pages;
DROP POLICY IF EXISTS "Admins can manage static pages" ON static_pages;

CREATE POLICY "Public can read static pages" ON static_pages FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage static pages" ON static_pages FOR ALL
  USING (public.auth_is_admin())
  WITH CHECK (public.auth_is_admin());

-- ------------------------------ storage.sql ---------------------------------
-- Storage (CMS image uploads). Needs auth_is_admin() from rls.sql above.

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-uploads', 'cms-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public read cms-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins insert cms-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins update cms-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete cms-uploads" ON storage.objects;

CREATE POLICY "Public read cms-uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-uploads');

CREATE POLICY "Admins insert cms-uploads"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-uploads' AND public.auth_is_admin());

CREATE POLICY "Admins update cms-uploads"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-uploads' AND public.auth_is_admin())
  WITH CHECK (bucket_id = 'cms-uploads' AND public.auth_is_admin());

CREATE POLICY "Admins delete cms-uploads"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cms-uploads' AND public.auth_is_admin());
