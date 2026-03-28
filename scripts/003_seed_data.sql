-- Seed categories
INSERT INTO categories (slug, name_en, name_fr, description_en, description_fr, image_url) VALUES
('main-dishes', 'Main Dishes', 'Plats Principaux', 'Hearty main courses for any occasion', 'Plats principaux copieux pour toutes les occasions', 'https://placehold.co/800x600/C0392B/FFFFFF?text=Main+Dishes'),
('desserts', 'Desserts', 'Desserts', 'Sweet treats and indulgent desserts', 'Douceurs et desserts gourmands', 'https://placehold.co/800x600/F39C12/FFFFFF?text=Desserts'),
('appetizers', 'Appetizers', 'Entrées', 'Perfect starters for your meal', 'Entrées parfaites pour votre repas', 'https://placehold.co/800x600/27AE60/FFFFFF?text=Appetizers'),
('soups', 'Soups', 'Soupes', 'Warm and comforting soups', 'Soupes chaudes et réconfortantes', 'https://placehold.co/800x600/3498DB/FFFFFF?text=Soups');

-- Seed sample recipes
INSERT INTO recipes (slug, title_en, title_fr, description_en, description_fr, ingredients_en, ingredients_fr, instructions_en, instructions_fr, prep_time_minutes, cook_time_minutes, servings, difficulty, image_url, category_id, is_featured, is_published) VALUES
('classic-chicken-adobo', 'Classic Chicken Adobo', 'Adobo de Poulet Classique', 
 'A beloved Filipino dish with tender chicken braised in vinegar, soy sauce, and garlic.', 
 'Un plat philippin adoré avec du poulet tendre braisé au vinaigre, sauce soja et ail.',
 '["2 lbs chicken pieces", "1/2 cup soy sauce", "1/2 cup white vinegar", "6 cloves garlic", "2 bay leaves", "1 tsp black peppercorns", "1 cup water"]',
 '["900g morceaux de poulet", "120ml sauce soja", "120ml vinaigre blanc", "6 gousses d''ail", "2 feuilles de laurier", "1 c. à café poivre noir", "240ml eau"]',
 '["Combine chicken, soy sauce, vinegar, garlic, bay leaves, and peppercorns in a pot.", "Add water and bring to a boil.", "Reduce heat and simmer for 30-40 minutes until chicken is tender.", "Optional: Remove chicken and fry until golden, then return to sauce.", "Serve hot with steamed rice."]',
 '["Combiner le poulet, la sauce soja, le vinaigre, l''ail, les feuilles de laurier et le poivre dans une casserole.", "Ajouter l''eau et porter à ébullition.", "Réduire le feu et laisser mijoter 30-40 minutes jusqu''à ce que le poulet soit tendre.", "Optionnel: Retirer le poulet et le faire frire jusqu''à doré, puis remettre dans la sauce.", "Servir chaud avec du riz vapeur."]',
 15, 45, 4, 'easy', 'https://placehold.co/800x600/C0392B/FFFFFF?text=Chicken+Adobo',
 (SELECT id FROM categories WHERE slug = 'main-dishes'), TRUE, TRUE),

('creamy-leche-flan', 'Creamy Leche Flan', 'Flan au Lait Crémeux',
 'A silky smooth Filipino caramel custard that melts in your mouth.',
 'Un flan caramel philippin soyeux et onctueux qui fond dans la bouche.',
 '["10 egg yolks", "1 can condensed milk (14 oz)", "1 can evaporated milk (12 oz)", "1 tsp vanilla extract", "1 cup sugar for caramel"]',
 '["10 jaunes d''œufs", "1 boîte lait concentré (400g)", "1 boîte lait évaporé (350ml)", "1 c. à café extrait de vanille", "200g sucre pour le caramel"]',
 '["Make caramel by melting sugar in a llanera or mold until golden brown.", "Mix egg yolks, condensed milk, evaporated milk, and vanilla. Strain mixture.", "Pour mixture over caramel.", "Steam for 45-60 minutes or until set.", "Cool completely, then invert onto a plate to serve."]',
 '["Faire le caramel en faisant fondre le sucre dans un moule jusqu''à brun doré.", "Mélanger les jaunes d''œufs, le lait concentré, le lait évaporé et la vanille. Filtrer.", "Verser le mélange sur le caramel.", "Cuire à la vapeur 45-60 minutes jusqu''à prise.", "Laisser refroidir complètement, puis démouler sur une assiette."]',
 20, 60, 8, 'medium', 'https://placehold.co/800x600/F39C12/FFFFFF?text=Leche+Flan',
 (SELECT id FROM categories WHERE slug = 'desserts'), TRUE, TRUE),

('garlic-butter-shrimp', 'Garlic Butter Shrimp', 'Crevettes au Beurre à l''Ail',
 'Succulent shrimp sautéed in rich garlic butter - ready in 15 minutes!',
 'Crevettes succulentes sautées dans un beurre à l''ail riche - prêt en 15 minutes!',
 '["1 lb large shrimp, peeled and deveined", "4 tbsp butter", "8 cloves garlic, minced", "1/4 cup white wine", "Fresh parsley, chopped", "Salt and pepper to taste", "Lemon wedges"]',
 '["450g grosses crevettes, décortiquées", "60g beurre", "8 gousses d''ail, émincées", "60ml vin blanc", "Persil frais, haché", "Sel et poivre au goût", "Quartiers de citron"]',
 '["Melt butter in a large skillet over medium-high heat.", "Add garlic and sauté for 30 seconds until fragrant.", "Add shrimp in a single layer, cook 2 minutes per side.", "Pour in white wine and cook 1 minute more.", "Season with salt and pepper, garnish with parsley.", "Serve immediately with lemon wedges."]',
 '["Faire fondre le beurre dans une grande poêle à feu moyen-vif.", "Ajouter l''ail et faire sauter 30 secondes.", "Ajouter les crevettes en une seule couche, cuire 2 minutes de chaque côté.", "Verser le vin blanc et cuire 1 minute de plus.", "Assaisonner, garnir de persil.", "Servir immédiatement avec des quartiers de citron."]',
 10, 8, 4, 'easy', 'https://placehold.co/800x600/E74C3C/FFFFFF?text=Garlic+Shrimp',
 (SELECT id FROM categories WHERE slug = 'main-dishes'), FALSE, TRUE),

('sinigang-na-baboy', 'Sinigang na Baboy', 'Sinigang de Porc',
 'A tangy tamarind-based pork soup with vegetables - pure Filipino comfort food.',
 'Une soupe de porc acidulée au tamarin avec des légumes - pur réconfort philippin.',
 '["2 lbs pork ribs or belly", "1 packet tamarind soup mix", "2 tomatoes, quartered", "1 onion, quartered", "1 bunch kangkong (water spinach)", "2 long green peppers", "1 radish, sliced", "String beans", "Fish sauce to taste"]',
 '["900g travers ou poitrine de porc", "1 sachet mélange soupe tamarin", "2 tomates, en quartiers", "1 oignon, en quartiers", "1 botte épinards d''eau", "2 piments verts longs", "1 radis, tranché", "Haricots verts", "Sauce poisson au goût"]',
 '["Boil pork in water until tender, about 1 hour. Skim off scum.", "Add tomatoes and onion, simmer 10 minutes.", "Add tamarind soup mix and radish, cook 5 minutes.", "Add string beans and green peppers, cook 3 minutes.", "Add kangkong last, cook 1 minute until wilted.", "Season with fish sauce. Serve hot with rice."]',
 '["Faire bouillir le porc dans l''eau jusqu''à tendreté, environ 1 heure. Écumer.", "Ajouter tomates et oignon, mijoter 10 minutes.", "Ajouter le mélange tamarin et le radis, cuire 5 minutes.", "Ajouter haricots et piments, cuire 3 minutes.", "Ajouter les épinards d''eau en dernier, cuire 1 minute.", "Assaisonner avec sauce poisson. Servir chaud avec du riz."]',
 15, 75, 6, 'easy', 'https://placehold.co/800x600/27AE60/FFFFFF?text=Sinigang',
 (SELECT id FROM categories WHERE slug = 'soups'), TRUE, TRUE);

-- Seed blog posts
INSERT INTO blog_posts (slug, title_en, title_fr, excerpt_en, excerpt_fr, content_en, content_fr, image_url, is_published, published_at) VALUES
('essential-filipino-pantry', 'Essential Filipino Pantry Staples', 'Essentiels du Garde-Manger Philippin',
 'Stock your kitchen with these must-have ingredients for authentic Filipino cooking.',
 'Garnissez votre cuisine avec ces ingrédients indispensables pour une cuisine philippine authentique.',
 'Every great Filipino dish starts with a well-stocked pantry. Here are the essential ingredients you need:\n\n## Soy Sauce (Toyo)\nThe backbone of many dishes like adobo and pancit.\n\n## Vinegar (Suka)\nWhite cane vinegar is most common, but try coconut vinegar for a milder taste.\n\n## Fish Sauce (Patis)\nAdds that unmistakable umami depth to soups and sautés.\n\n## Garlic\nUsed generously in almost every savory Filipino dish.\n\n## Tamarind\nFor that signature sour taste in sinigang.',
 'Chaque grand plat philippin commence par un garde-manger bien garni. Voici les ingrédients essentiels:\n\n## Sauce Soja (Toyo)\nLa base de nombreux plats comme l''adobo et le pancit.\n\n## Vinaigre (Suka)\nLe vinaigre de canne blanc est le plus courant.\n\n## Sauce Poisson (Patis)\nAjoute cette profondeur umami incomparable.\n\n## Ail\nUtilisé généreusement dans presque tous les plats salés.\n\n## Tamarin\nPour ce goût aigre signature dans le sinigang.',
 'https://placehold.co/800x600/8E44AD/FFFFFF?text=Filipino+Pantry',
 TRUE, NOW());
