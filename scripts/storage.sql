-- Supabase Storage: public CMS images bucket and RLS.
-- Run AFTER rls.sql (auth_is_admin must exist). Also part of install_fresh_database.sql.

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-uploads', 'cms-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Objects in storage.objects: allow public read, admin-only writes.
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
