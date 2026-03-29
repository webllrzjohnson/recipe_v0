-- Optional one-shot patches for databases created from an older schema snapshot
-- that is missing site_settings and/or static_pages.
--
-- Requires: rls.sql already applied (public.auth_is_admin() must exist).
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS / ON CONFLICT DO NOTHING.
--
-- New projects: prefer schema.sql → rls.sql instead of this file.
-- Slugs used in static_pages: home, about, privacy, terms, disclaimer, cookies.

-- ---------------------------------------------------------------------------
-- site_settings (singleton row id = 1, ads configuration)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS site_settings (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  ads_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  adsense_publisher_id TEXT,
  adsense_placements JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (id, ads_enabled, adsense_publisher_id, adsense_placements)
VALUES (1, FALSE, NULL, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL
  USING (public.auth_is_admin())
  WITH CHECK (public.auth_is_admin());

-- ---------------------------------------------------------------------------
-- static_pages (per slug + locale JSON content)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS static_pages (
  page_slug TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (page_slug, locale)
);

ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read static pages" ON static_pages;
DROP POLICY IF EXISTS "Admins can manage static pages" ON static_pages;

CREATE POLICY "Public can read static pages" ON static_pages FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage static pages" ON static_pages FOR ALL
  USING (public.auth_is_admin())
  WITH CHECK (public.auth_is_admin());
