-- Sample HTML “story” blocks above the recipe card (see 008_add_recipe_blog.sql).
-- Safe to re-run: overwrites blog_en / blog_fr for these slugs.

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
