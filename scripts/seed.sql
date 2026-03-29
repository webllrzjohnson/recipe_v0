-- Demo content: categories, recipes, blog post, plus sample notes/nutrition/recipe blog HTML.
-- Safe to re-run only on a fresh DB (INSERTs will conflict). For resets, TRUNCATE or drop tables first.
-- Run after install_fresh_database.sql (or schema.sql + rls_and_storage.sql).

-- Categories
INSERT INTO categories (slug_en, name_en, description_en, image_url) VALUES
('main-dishes', 'Main Dishes', 'Hearty main courses for any occasion', 'https://placehold.co/800x600/C0392B/FFFFFF?text=Main+Dishes'),
('desserts', 'Desserts', 'Sweet treats and indulgent desserts', 'https://placehold.co/800x600/F39C12/FFFFFF?text=Desserts'),
('appetizers', 'Appetizers', 'Perfect starters for your meal', 'https://placehold.co/800x600/27AE60/FFFFFF?text=Appetizers'),
('soups', 'Soups', 'Warm and comforting soups', 'https://placehold.co/800x600/3498DB/FFFFFF?text=Soups');

-- Recipes
INSERT INTO recipes (slug_en, title_en, description_en, ingredients_en, instructions_en, prep_time_minutes, cook_time_minutes, servings, difficulty, image_url, category_id, is_featured, is_published) VALUES
('classic-chicken-adobo', 'Classic Chicken Adobo',
 'A beloved Filipino dish with tender chicken braised in vinegar, soy sauce, and garlic.',
 '["2 lbs chicken pieces", "1/2 cup soy sauce", "1/2 cup white vinegar", "6 cloves garlic", "2 bay leaves", "1 tsp black peppercorns", "1 cup water"]',
 '["Combine chicken, soy sauce, vinegar, garlic, bay leaves, and peppercorns in a pot.", "Add water and bring to a boil.", "Reduce heat and simmer for 30-40 minutes until chicken is tender.", "Optional: Remove chicken and fry until golden, then return to sauce.", "Serve hot with steamed rice."]',
 15, 45, 4, 'easy', 'https://placehold.co/800x600/C0392B/FFFFFF?text=Chicken+Adobo',
 (SELECT id FROM categories WHERE slug_en = 'main-dishes'), TRUE, TRUE),

('creamy-leche-flan', 'Creamy Leche Flan',
 'A silky smooth Filipino caramel custard that melts in your mouth.',
 '["10 egg yolks", "1 can condensed milk (14 oz)", "1 can evaporated milk (12 oz)", "1 tsp vanilla extract", "1 cup sugar for caramel"]',
 '["Make caramel by melting sugar in a llanera or mold until golden brown.", "Mix egg yolks, condensed milk, evaporated milk, and vanilla. Strain mixture.", "Pour mixture over caramel.", "Steam for 45-60 minutes or until set.", "Cool completely, then invert onto a plate to serve."]',
 20, 60, 8, 'medium', 'https://placehold.co/800x600/F39C12/FFFFFF?text=Leche+Flan',
 (SELECT id FROM categories WHERE slug_en = 'desserts'), TRUE, TRUE),

('garlic-butter-shrimp', 'Garlic Butter Shrimp',
 'Succulent shrimp sautéed in rich garlic butter - ready in 15 minutes!',
 '["1 lb large shrimp, peeled and deveined", "4 tbsp butter", "8 cloves garlic, minced", "1/4 cup white wine", "Fresh parsley, chopped", "Salt and pepper to taste", "Lemon wedges"]',
 '["Melt butter in a large skillet over medium-high heat.", "Add garlic and sauté for 30 seconds until fragrant.", "Add shrimp in a single layer, cook 2 minutes per side.", "Pour in white wine and cook 1 minute more.", "Season with salt and pepper, garnish with parsley.", "Serve immediately with lemon wedges."]',
 10, 8, 4, 'easy', 'https://placehold.co/800x600/E74C3C/FFFFFF?text=Garlic+Shrimp',
 (SELECT id FROM categories WHERE slug_en = 'main-dishes'), FALSE, TRUE),

('sinigang-na-baboy', 'Sinigang na Baboy',
 'A tangy tamarind-based pork soup with vegetables - pure Filipino comfort food.',
 '["2 lbs pork ribs or belly", "1 packet tamarind soup mix", "2 tomatoes, quartered", "1 onion, quartered", "1 bunch kangkong (water spinach)", "2 long green peppers", "1 radish, sliced", "String beans", "Fish sauce to taste"]',
 '["Boil pork in water until tender, about 1 hour. Skim off scum.", "Add tomatoes and onion, simmer 10 minutes.", "Add tamarind soup mix and radish, cook 5 minutes.", "Add string beans and green peppers, cook 3 minutes.", "Add kangkong last, cook 1 minute until wilted.", "Season with fish sauce. Serve hot with rice."]',
 15, 75, 6, 'easy', 'https://placehold.co/800x600/27AE60/FFFFFF?text=Sinigang',
 (SELECT id FROM categories WHERE slug_en = 'soups'), TRUE, TRUE);

-- Blog post
INSERT INTO blog_posts (slug, title_en, excerpt_en, content_en, image_url, is_published, published_at) VALUES
('essential-filipino-pantry', 'Essential Filipino Pantry Staples',
 'Stock your kitchen with these must-have ingredients for authentic Filipino cooking.',
 'Every great Filipino dish starts with a well-stocked pantry. Here are the essential ingredients you need:\n\n## Soy Sauce (Toyo)\nThe backbone of many dishes like adobo and pancit.\n\n## Vinegar (Suka)\nWhite cane vinegar is most common, but try coconut vinegar for a milder taste.\n\n## Fish Sauce (Patis)\nAdds that unmistakable umami depth to soups and sautés.\n\n## Garlic\nUsed generously in almost every savory Filipino dish.\n\n## Tamarind\nFor that signature sour taste in sinigang.',
 'https://placehold.co/800x600/8E44AD/FFFFFF?text=Filipino+Pantry',
 TRUE, NOW());

-- Sample notes + nutrition
UPDATE recipes SET
  notes_en = 'Best enjoyed fresh. Adjust soy sauce and vinegar to taste—some like it more tangy.',
  nutrition_en = '["Calories: ~350 kcal per serving", "Protein: ~35 g", "Sodium: High (soy sauce)—use low-sodium if needed"]'::jsonb
WHERE slug_en = 'classic-chicken-adobo';

UPDATE recipes SET
  notes_en = 'Chill thoroughly before unmolding. Run a thin knife around the edge if it sticks.',
  nutrition_en = '["Calories: ~220 kcal per slice (1/8)", "Sugar: moderate", "Rich in calcium from milk"]'::jsonb
WHERE slug_en = 'creamy-leche-flan';

UPDATE recipes SET
  notes_en = 'Do not overcook shrimp—they turn rubbery quickly. Pat dry before cooking for best sear.',
  nutrition_en = '["Calories: ~280 kcal per serving", "Protein: ~28 g", "Low carb"]'::jsonb
WHERE slug_en = 'garlic-butter-shrimp';

UPDATE recipes SET
  notes_en = 'Sourness is personal—add more tamarind mix or a pinch of sugar to balance.',
  nutrition_en = '["Calories: ~320 kcal per serving", "Protein: ~22 g", "Vitamin C: from tomatoes and vegetables"]'::jsonb
WHERE slug_en = 'sinigang-na-baboy';

-- Recipe “story” HTML (blog_en)
UPDATE recipes SET
  blog_en = $b$
<h2>Why this adobo works</h2>
<p>In many Filipino homes, adobo is less a single recipe than a rhythm: nostalgia and pantry staples in one pot. This version keeps the classic balance of vinegar and soy—tangy, deeply savory, and perfect over steamed rice.</p>
<p>Let the braise go slowly; the sauce tightens into something you will want to spoon over everything.</p>
<blockquote><p>If the sauce tastes too sharp at first, a pinch of sugar or a few extra minutes of simmering rounds it out.</p></blockquote>
$b$
WHERE slug_en = 'classic-chicken-adobo';

UPDATE recipes SET
  blog_en = $b$
<h2>A custard for celebrations</h2>
<p>Leche flan shows up at birthdays, potlucks, and quiet Sundays alike. The trick is patience: a smooth custard needs gentle heat and a good strain so the texture stays silky.</p>
<p>I still remember the clink of spoons against glass llaneras and the smell of caramel darkening in the pan—make the caramel a shade braver than you think; it balances the sweetness of the milk.</p>
<hr />
<p><strong>Serve</strong> chilled, in thin slices—a little goes a long way.</p>
$b$
WHERE slug_en = 'creamy-leche-flan';

UPDATE recipes SET
  blog_en = $b$
<h2>Fifteen minutes, big flavor</h2>
<p>This is the dish I make when the day ran long but we still want something that feels a little special. Garlic, butter, and a splash of white wine turn shrimp into a quick bistro-style plate.</p>
<ul>
<li>Pat the shrimp dry for a better sear.</li>
<li>Pull them off the heat while they still look slightly opaque—they finish as they rest.</li>
</ul>
<p>A squeeze of lemon at the table wakes everything up.</p>
$b$
WHERE slug_en = 'garlic-butter-shrimp';

UPDATE recipes SET
  blog_en = $b$
<h2>Comfort in a sour broth</h2>
<p>Sinigang is comfort food with a backbone of tang. The soup should taste lively—tomatoes, tamarind, and tender pork in one bowl—but every household dials the sourness differently.</p>
<p>Start with the packet or paste you trust, then adjust with fish sauce (or a little salt) until the broth tastes bright and savory at once.</p>
<blockquote><p>Add leafy greens at the very end so they keep their color and bite.</p></blockquote>
$b$
WHERE slug_en = 'sinigang-na-baboy';

-- Default site settings (AdSense off until configured in admin)
INSERT INTO site_settings (id, site_name, site_tagline, color_scheme, font_pair, ads_enabled, adsense_publisher_id, adsense_placements)
VALUES (1, 'Sarap Kitchen', 'Delicious Filipino Recipes', 'tomato_sage', 'baskerville_raleway', FALSE, NULL, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
