-- Row level security, policies, and Supabase Storage (cms-uploads bucket).
-- Run after schema.sql. Embedded in install_fresh_database.sql for one-shot installs.

-- ---------------------------------------------------------------------------
-- RLS + auth_is_admin
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- Storage: public CMS uploads bucket (requires auth_is_admin above)
-- ---------------------------------------------------------------------------

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
