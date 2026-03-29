-- Rich HTML intro shown above the recipe card (images, links, YouTube embeds, etc.)
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS blog_en TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS blog_fr TEXT;
