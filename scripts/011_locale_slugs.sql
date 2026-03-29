-- One-time migration: only if your database still has a single `slug` column on
-- recipes/categories (from an older 001_create_tables.sql). New projects should
-- use the current 001 + 003 instead. Do not run this after applying the new schema.

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

CREATE INDEX idx_recipes_slug_en ON recipes (slug_en);
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
