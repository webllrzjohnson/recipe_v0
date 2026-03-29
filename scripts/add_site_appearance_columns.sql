-- Tagline, theme presets, and favicon URL for /admin/settings (site_settings row id = 1).
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS site_tagline TEXT NOT NULL DEFAULT 'Delicious Filipino Recipes';

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS color_scheme TEXT NOT NULL DEFAULT 'tomato_sage';

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS font_pair TEXT NOT NULL DEFAULT 'baskerville_raleway';

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS favicon_url TEXT;
