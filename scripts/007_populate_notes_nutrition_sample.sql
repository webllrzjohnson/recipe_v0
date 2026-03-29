-- Sample notes + nutrition so recipe detail pages show those blocks (006 only adds empty columns).
-- Safe to re-run: overwrites notes/nutrition for these slugs.

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
