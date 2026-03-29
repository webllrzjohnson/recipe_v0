-- Legacy migration only: databases that still use a single `slug` column on
-- recipes/categories (older schema). Do NOT run on a database created from schema.sql.
--
-- After running: your rows use slug_en / slug_fr (legacy). Current app + schema are English-only;
-- run drop_legacy_french_columns.sql after upgrading, or use a fresh install_fresh_database.sql.

DROP INDEX IF EXISTS idx_recipes_slug;
DROP INDEX IF EXISTS idx_categories_slug;

ALTER TABLE recipes ADD COLUMN slug_en TEXT;
ALTER TABLE recipes ADD COLUMN slug_fr TEXT;

UPDATE recipes SET slug_en = slug, slug_fr = slug;

ALTER TABLE recipes ALTER COLUMN slug_en SET NOT NULL;

ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_slug_key;
ALTER TABLE recipes DROP COLUMN slug;

ALTER TABLE recipes ADD CONSTRAINT recipes_slug_en_key UNIQUE (slug_en);
CREATE UNIQUE INDEX recipes_slug_fr_unique
  ON recipes (slug_fr)
  WHERE slug_fr IS NOT NULL AND length(trim(slug_fr)) > 0;

CREATE INDEX idx_recipes_slug_en ON recipes(slug_en);
CREATE INDEX idx_recipes_slug_fr ON recipes(slug_fr) WHERE slug_fr IS NOT NULL;

ALTER TABLE categories ADD COLUMN slug_en TEXT;
ALTER TABLE categories ADD COLUMN slug_fr TEXT;

UPDATE categories SET slug_en = slug, slug_fr = slug;

ALTER TABLE categories ALTER COLUMN slug_en SET NOT NULL;

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE categories DROP COLUMN slug;

ALTER TABLE categories ADD CONSTRAINT categories_slug_en_key UNIQUE (slug_en);
CREATE UNIQUE INDEX categories_slug_fr_unique
  ON categories (slug_fr)
  WHERE slug_fr IS NOT NULL AND length(trim(slug_fr)) > 0;

CREATE INDEX idx_categories_slug_en ON categories(slug_en);
CREATE INDEX idx_categories_slug_fr ON categories(slug_fr) WHERE slug_fr IS NOT NULL;
