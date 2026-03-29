-- Optional recipe notes and nutrition facts (one string per fact, e.g. "Calories: 798 kcal (40%)")
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS notes_en TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS notes_fr TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS nutrition_en JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS nutrition_fr JSONB NOT NULL DEFAULT '[]'::jsonb;
