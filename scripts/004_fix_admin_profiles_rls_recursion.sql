-- Fix: "infinite recursion detected in policy for relation admin_profiles"
-- Run once in Supabase SQL Editor if you already applied an older 002_rls_policies.sql.
-- Safe to run multiple times.

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
