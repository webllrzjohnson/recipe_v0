-- Remove legacy French (*_fr) columns from recipes, categories, and blog_posts.
-- Run once in the Supabase SQL Editor after deploying app code that no longer uses them.
-- Safe to re-run: uses IF EXISTS.

-- Recipes
DROP INDEX IF EXISTS recipes_slug_fr_unique;
DROP INDEX IF EXISTS idx_recipes_slug_fr;

ALTER TABLE recipes
  DROP COLUMN IF EXISTS slug_fr,
  DROP COLUMN IF EXISTS title_fr,
  DROP COLUMN IF EXISTS description_fr,
  DROP COLUMN IF EXISTS blog_fr,
  DROP COLUMN IF EXISTS ingredients_fr,
  DROP COLUMN IF EXISTS instructions_fr,
  DROP COLUMN IF EXISTS notes_fr,
  DROP COLUMN IF EXISTS nutrition_fr;

-- Categories
DROP INDEX IF EXISTS categories_slug_fr_unique;
DROP INDEX IF EXISTS idx_categories_slug_fr;

ALTER TABLE categories
  DROP COLUMN IF EXISTS slug_fr,
  DROP COLUMN IF EXISTS name_fr,
  DROP COLUMN IF EXISTS description_fr;

-- Blog posts
ALTER TABLE blog_posts
  DROP COLUMN IF EXISTS title_fr,
  DROP COLUMN IF EXISTS excerpt_fr,
  DROP COLUMN IF EXISTS content_fr;
