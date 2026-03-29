-- Demo content: categories, recipes, blog post, plus sample notes/nutrition/recipe blog HTML.
-- Safe to re-run only on a fresh DB (INSERTs will conflict). For resets, TRUNCATE or drop tables first.
-- Run after schema.sql and rls.sql.

-- Categories
INSERT INTO categories (slug_en, slug_fr, name_en, name_fr, description_en, description_fr, image_url) VALUES
('main-dishes', 'plats-principaux', 'Main Dishes', 'Plats Principaux', 'Hearty main courses for any occasion', 'Plats principaux copieux pour toutes les occasions', 'https://placehold.co/800x600/C0392B/FFFFFF?text=Main+Dishes'),
('desserts', 'desserts', 'Desserts', 'Desserts', 'Sweet treats and indulgent desserts', 'Douceurs et desserts gourmands', 'https://placehold.co/800x600/F39C12/FFFFFF?text=Desserts'),
('appetizers', 'entrees', 'Appetizers', 'Entrées', 'Perfect starters for your meal', 'Entrées parfaites pour votre repas', 'https://placehold.co/800x600/27AE60/FFFFFF?text=Appetizers'),
('soups', 'soupes', 'Soups', 'Soupes', 'Warm and comforting soups', 'Soupes chaudes et réconfortantes', 'https://placehold.co/800x600/3498DB/FFFFFF?text=Soups');

-- Recipes
INSERT INTO recipes (slug_en, slug_fr, title_en, title_fr, description_en, description_fr, ingredients_en, ingredients_fr, instructions_en, instructions_fr, prep_time_minutes, cook_time_minutes, servings, difficulty, image_url, category_id, is_featured, is_published) VALUES
('classic-chicken-adobo', 'adobo-poulet-classique', 'Classic Chicken Adobo', 'Adobo de Poulet Classique',
 'A beloved Filipino dish with tender chicken braised in vinegar, soy sauce, and garlic.',
 'Un plat philippin adoré avec du poulet tendre braisé au vinaigre, sauce soja et ail.',
 '["2 lbs chicken pieces", "1/2 cup soy sauce", "1/2 cup white vinegar", "6 cloves garlic", "2 bay leaves", "1 tsp black peppercorns", "1 cup water"]',
 '["900g morceaux de poulet", "120ml sauce soja", "120ml vinaigre blanc", "6 gousses d''ail", "2 feuilles de laurier", "1 c. à café poivre noir", "240ml eau"]',
 '["Combine chicken, soy sauce, vinegar, garlic, bay leaves, and peppercorns in a pot.", "Add water and bring to a boil.", "Reduce heat and simmer for 30-40 minutes until chicken is tender.", "Optional: Remove chicken and fry until golden, then return to sauce.", "Serve hot with steamed rice."]',
 '["Combiner le poulet, la sauce soja, le vinaigre, l''ail, les feuilles de laurier et le poivre dans une casserole.", "Ajouter l''eau et porter à ébullition.", "Réduire le feu et laisser mijoter 30-40 minutes jusqu''à ce que le poulet soit tendre.", "Optionnel: Retirer le poulet et le faire frire jusqu''à doré, puis remettre dans la sauce.", "Servir chaud avec du riz vapeur."]',
 15, 45, 4, 'easy', 'https://placehold.co/800x600/C0392B/FFFFFF?text=Chicken+Adobo',
 (SELECT id FROM categories WHERE slug_en = 'main-dishes'), TRUE, TRUE),

('creamy-leche-flan', 'flan-au-lait-cremeux', 'Creamy Leche Flan', 'Flan au Lait Crémeux',
 'A silky smooth Filipino caramel custard that melts in your mouth.',
 'Un flan caramel philippin soyeux et onctueux qui fond dans la bouche.',
 '["10 egg yolks", "1 can condensed milk (14 oz)", "1 can evaporated milk (12 oz)", "1 tsp vanilla extract", "1 cup sugar for caramel"]',
 '["10 jaunes d''œufs", "1 boîte lait concentré (400g)", "1 boîte lait évaporé (350ml)", "1 c. à café extrait de vanille", "200g sucre pour le caramel"]',
 '["Make caramel by melting sugar in a llanera or mold until golden brown.", "Mix egg yolks, condensed milk, evaporated milk, and vanilla. Strain mixture.", "Pour mixture over caramel.", "Steam for 45-60 minutes or until set.", "Cool completely, then invert onto a plate to serve."]',
 '["Faire le caramel en faisant fondre le sucre dans un moule jusqu''à brun doré.", "Mélanger les jaunes d''œufs, le lait concentré, le lait évaporé et la vanille. Filtrer.", "Verser le mélange sur le caramel.", "Cuire à la vapeur 45-60 minutes jusqu''à prise.", "Laisser refroidir complètement, puis démouler sur une assiette."]',
 20, 60, 8, 'medium', 'https://placehold.co/800x600/F39C12/FFFFFF?text=Leche+Flan',
 (SELECT id FROM categories WHERE slug_en = 'desserts'), TRUE, TRUE),

('garlic-butter-shrimp', 'crevettes-beurre-ail', 'Garlic Butter Shrimp', 'Crevettes au Beurre à l''Ail',
 'Succulent shrimp sautéed in rich garlic butter - ready in 15 minutes!',
 'Crevettes succulentes sautées dans un beurre à l''ail riche - prêt en 15 minutes!',
 '["1 lb large shrimp, peeled and deveined", "4 tbsp butter", "8 cloves garlic, minced", "1/4 cup white wine", "Fresh parsley, chopped", "Salt and pepper to taste", "Lemon wedges"]',
 '["450g grosses crevettes, décortiquées", "60g beurre", "8 gousses d''ail, émincées", "60ml vin blanc", "Persil frais, haché", "Sel et poivre au goût", "Quartiers de citron"]',
 '["Melt butter in a large skillet over medium-high heat.", "Add garlic and sauté for 30 seconds until fragrant.", "Add shrimp in a single layer, cook 2 minutes per side.", "Pour in white wine and cook 1 minute more.", "Season with salt and pepper, garnish with parsley.", "Serve immediately with lemon wedges."]',
 '["Faire fondre le beurre dans une grande poêle à feu moyen-vif.", "Ajouter l''ail et faire sauter 30 secondes.", "Ajouter les crevettes en une seule couche, cuire 2 minutes de chaque côté.", "Verser le vin blanc et cuire 1 minute de plus.", "Assaisonner, garnir de persil.", "Servir immédiatement avec des quartiers de citron."]',
 10, 8, 4, 'easy', 'https://placehold.co/800x600/E74C3C/FFFFFF?text=Garlic+Shrimp',
 (SELECT id FROM categories WHERE slug_en = 'main-dishes'), FALSE, TRUE),

('sinigang-na-baboy', 'sinigang-porc', 'Sinigang na Baboy', 'Sinigang de Porc',
 'A tangy tamarind-based pork soup with vegetables - pure Filipino comfort food.',
 'Une soupe de porc acidulée au tamarin avec des légumes - pur réconfort philippin.',
 '["2 lbs pork ribs or belly", "1 packet tamarind soup mix", "2 tomatoes, quartered", "1 onion, quartered", "1 bunch kangkong (water spinach)", "2 long green peppers", "1 radish, sliced", "String beans", "Fish sauce to taste"]',
 '["900g travers ou poitrine de porc", "1 sachet mélange soupe tamarin", "2 tomates, en quartiers", "1 oignon, en quartiers", "1 botte épinards d''eau", "2 piments verts longs", "1 radis, tranché", "Haricots verts", "Sauce poisson au goût"]',
 '["Boil pork in water until tender, about 1 hour. Skim off scum.", "Add tomatoes and onion, simmer 10 minutes.", "Add tamarind soup mix and radish, cook 5 minutes.", "Add string beans and green peppers, cook 3 minutes.", "Add kangkong last, cook 1 minute until wilted.", "Season with fish sauce. Serve hot with rice."]',
 '["Faire bouillir le porc dans l''eau jusqu''à tendreté, environ 1 heure. Écumer.", "Ajouter tomates et oignon, mijoter 10 minutes.", "Ajouter le mélange tamarin et le radis, cuire 5 minutes.", "Ajouter haricots et piments, cuire 3 minutes.", "Ajouter les épinards d''eau en dernier, cuire 1 minute.", "Assaisonner avec sauce poisson. Servir chaud avec du riz."]',
 15, 75, 6, 'easy', 'https://placehold.co/800x600/27AE60/FFFFFF?text=Sinigang',
 (SELECT id FROM categories WHERE slug_en = 'soups'), TRUE, TRUE);

-- Blog post
INSERT INTO blog_posts (slug, title_en, title_fr, excerpt_en, excerpt_fr, content_en, content_fr, image_url, is_published, published_at) VALUES
('essential-filipino-pantry', 'Essential Filipino Pantry Staples', 'Essentiels du Garde-Manger Philippin',
 'Stock your kitchen with these must-have ingredients for authentic Filipino cooking.',
 'Garnissez votre cuisine avec ces ingrédients indispensables pour une cuisine philippine authentique.',
 'Every great Filipino dish starts with a well-stocked pantry. Here are the essential ingredients you need:\n\n## Soy Sauce (Toyo)\nThe backbone of many dishes like adobo and pancit.\n\n## Vinegar (Suka)\nWhite cane vinegar is most common, but try coconut vinegar for a milder taste.\n\n## Fish Sauce (Patis)\nAdds that unmistakable umami depth to soups and sautés.\n\n## Garlic\nUsed generously in almost every savory Filipino dish.\n\n## Tamarind\nFor that signature sour taste in sinigang.',
 'Chaque grand plat philippin commence par un garde-manger bien garni. Voici les ingrédients essentiels:\n\n## Sauce Soja (Toyo)\nLa base de nombreux plats comme l''adobo et le pancit.\n\n## Vinaigre (Suka)\nLe vinaigre de canne blanc est le plus courant.\n\n## Sauce Poisson (Patis)\nAjoute cette profondeur umami incomparable.\n\n## Ail\nUtilisé généreusement dans presque tous les plats salés.\n\n## Tamarin\nPour ce goût aigre signature dans le sinigang.',
 'https://placehold.co/800x600/8E44AD/FFFFFF?text=Filipino+Pantry',
 TRUE, NOW());

-- Sample notes + nutrition
UPDATE recipes SET
  notes_en = 'Best enjoyed fresh. Adjust soy sauce and vinegar to taste—some like it more tangy.',
  notes_fr = 'Dégustez de préférence frais. Ajustez sauce soja et vinaigre selon le goût.',
  nutrition_en = '["Calories: ~350 kcal per serving", "Protein: ~35 g", "Sodium: High (soy sauce)—use low-sodium if needed"]'::jsonb,
  nutrition_fr = '["Calories : ~350 kcal par portion", "Protéines : ~35 g", "Sodium : élevé (sauce soja)—version allégée possible"]'::jsonb
WHERE slug_en = 'classic-chicken-adobo';

UPDATE recipes SET
  notes_en = 'Chill thoroughly before unmolding. Run a thin knife around the edge if it sticks.',
  notes_fr = 'Bien refroidir avant démoulage. Détacher le bord avec un couteau fin si besoin.',
  nutrition_en = '["Calories: ~220 kcal per slice (1/8)", "Sugar: moderate", "Rich in calcium from milk"]'::jsonb,
  nutrition_fr = '["Calories : ~220 kcal par part (1/8)", "Sucre : modéré", "Riche en calcium (lait)"]'::jsonb
WHERE slug_en = 'creamy-leche-flan';

UPDATE recipes SET
  notes_en = 'Do not overcook shrimp—they turn rubbery quickly. Pat dry before cooking for best sear.',
  notes_fr = 'Ne pas trop cuire les crevettes—elles durcissent vite. Les éponger avant cuisson pour bien saisir.',
  nutrition_en = '["Calories: ~280 kcal per serving", "Protein: ~28 g", "Low carb"]'::jsonb,
  nutrition_fr = '["Calories : ~280 kcal par portion", "Protéines : ~28 g", "Faible en glucides"]'::jsonb
WHERE slug_en = 'garlic-butter-shrimp';

UPDATE recipes SET
  notes_en = 'Sourness is personal—add more tamarind mix or a pinch of sugar to balance.',
  notes_fr = 'L’acidité est personnelle—ajouter du tamarin ou une pincée de sucre pour équilibrer.',
  nutrition_en = '["Calories: ~320 kcal per serving", "Protein: ~22 g", "Vitamin C: from tomatoes and vegetables"]'::jsonb,
  nutrition_fr = '["Calories : ~320 kcal par portion", "Protéines : ~22 g", "Vitamine C : tomates et légumes"]'::jsonb
WHERE slug_en = 'sinigang-na-baboy';

-- Recipe “story” HTML (blog_en / blog_fr)
UPDATE recipes SET
  blog_en = $b$
<h2>Why this adobo works</h2>
<p>In many Filipino homes, adobo is less a single recipe than a rhythm: nostalgia and pantry staples in one pot. This version keeps the classic balance of vinegar and soy—tangy, deeply savory, and perfect over steamed rice.</p>
<p>Let the braise go slowly; the sauce tightens into something you will want to spoon over everything.</p>
<blockquote><p>If the sauce tastes too sharp at first, a pinch of sugar or a few extra minutes of simmering rounds it out.</p></blockquote>
$b$,
  blog_fr = $b$
<h2>Pourquoi cette version fonctionne</h2>
<p>Dans beaucoup de foyers philippins, l’adobo est plus un rythme qu’une recette figée. Ici on garde l’équilibre classique vinaigre–soja, idéal sur du riz vapeur.</p>
<p>Un mijotage tranquille permet au poulet de s’attendrir et à la sauce de concentrer son goût.</p>
<blockquote><p>Si la sauce paraît trop vive, une pincée de sucre ou quelques minutes de cuisson en plus l’adoucit.</p></blockquote>
$b$
WHERE slug_en = 'classic-chicken-adobo';

UPDATE recipes SET
  blog_en = $b$
<h2>A custard for celebrations</h2>
<p>Leche flan shows up at birthdays, potlucks, and quiet Sundays alike. The trick is patience: a smooth custard needs gentle heat and a good strain so the texture stays silky.</p>
<p>I still remember the clink of spoons against glass llaneras and the smell of caramel darkening in the pan—make the caramel a shade braver than you think; it balances the sweetness of the milk.</p>
<hr />
<p><strong>Serve</strong> chilled, in thin slices—a little goes a long way.</p>
$b$,
  blog_fr = $b$
<h2>Un flan pour les grandes occasions</h2>
<p>Le flan au lait trône aux anniversaires, aux partages entre amis et aux dimanches tranquilles. Le secret, c’est la douceur de la cuisson et un bon passage au tamis pour un flan soyeux.</p>
<p>Le caramel peut effrayer au début: osez une teinte plus ambrée; elle contrebalance la douceur du lait concentré.</p>
<hr />
<p><strong>Service</strong> bien frais, en fines tranches.</p>
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
$b$,
  blog_fr = $b$
<h2>Quinze minutes, beaucoup de saveur</h2>
<p>La recette idéale quand la journée a été longue mais qu’on veut tout de même un plat qui en jette. Ail, beurre et un filet de vin blanc transforment des crevettes en plat express « bistro ».</p>
<ul>
<li>Épongez les crevettes pour bien les saisir.</li>
<li>Retirez-les du feu tant qu’elles semblent encore légèrement translucides: la chaleur résiduelle termine la cuisson.</li>
</ul>
<p>Un citron pressé à table relève le tout.</p>
$b$
WHERE slug_en = 'garlic-butter-shrimp';

UPDATE recipes SET
  blog_en = $b$
<h2>Comfort in a sour broth</h2>
<p>Sinigang is comfort food with a backbone of tang. The soup should taste lively—tomatoes, tamarind, and tender pork in one bowl—but every household dials the sourness differently.</p>
<p>Start with the packet or paste you trust, then adjust with fish sauce (or a little salt) until the broth tastes bright and savory at once.</p>
<blockquote><p>Add leafy greens at the very end so they keep their color and bite.</p></blockquote>
$b$,
  blog_fr = $b$
<h2>Réconfort dans un bouillon acidulé</h2>
<p>Le sinigang, c’est le réconfort avec une note vive. Chaque famille règle l’acidité à sa façon: tamarin, tomates et porc tendre partagent le bol.</p>
<p>Commencez avec votre base habituelle, puis équilibrez avec de la sauce poisson jusqu’à un bouillon à la fois vif et salé.</p>
<blockquote><p>Ajoutez les légumes verts à la toute fin pour garder couleur et croquant.</p></blockquote>
$b$
WHERE slug_en = 'sinigang-na-baboy';
