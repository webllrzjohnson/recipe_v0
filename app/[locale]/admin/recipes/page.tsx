import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil } from 'lucide-react';
import { DeleteRecipeButton } from '@/components/admin/delete-recipe-button';
import type { Recipe, Category } from '@/lib/types/database';

export default async function AdminRecipesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  // Fetch all recipes (admin can see all, published or not)
  const { data: recipesData } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false });

  const recipes = recipesData as (Recipe & { category: Category })[] || [];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t('recipes')}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'fr'
              ? 'Gérez vos recettes'
              : 'Manage your recipes'}
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/recipes/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addNew')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {locale === 'fr' ? 'Toutes les recettes' : 'All Recipes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recipes.length > 0 ? (
            <div className="divide-y divide-border">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {locale === 'fr' ? recipe.title_fr : recipe.title_en}
                      </p>
                      {recipe.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          {t('featured')}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      {recipe.category && (
                        <span>
                          {locale === 'fr'
                            ? recipe.category.name_fr
                            : recipe.category.name_en}
                        </span>
                      )}
                      <span>•</span>
                      <span
                        className={
                          recipe.is_published
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }
                      >
                        {recipe.is_published ? t('published') : t('draft')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/${locale}/admin/recipes/${recipe.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteRecipeButton recipeId={recipe.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              {locale === 'fr'
                ? 'Aucune recette trouvée'
                : 'No recipes found'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
