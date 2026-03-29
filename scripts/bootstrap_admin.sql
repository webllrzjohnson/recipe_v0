-- Grant admin UI access to an existing Auth user (run after install_fresh_database.sql).
-- 1. Supabase Dashboard → Authentication → Users → open your user → copy "User UID".
-- 2. Replace the placeholders below (id + email must match that user).
-- 3. Run in SQL Editor (runs with elevated privileges; safe for one-off bootstrap).

INSERT INTO public.admin_profiles (id, email, full_name, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid, -- ← paste User UID
  'you@example.com',                               -- ← same email as in Auth
  NULL,
  true
)
ON CONFLICT (id) DO UPDATE SET
  is_admin = true,
  email = EXCLUDED.email;
