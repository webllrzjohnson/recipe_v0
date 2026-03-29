import { redirect } from 'next/navigation';
import Link from 'next/link';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil } from 'lucide-react';
import { DeleteRecipeButton } from '@/components/admin/delete-recipe-button';
import type { Recipe, Category } from '@/lib/types/database';

const admin = copy.admin;

export default async function AdminRecipesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: recipesData } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false });

  const recipes = (recipesData as (Recipe & { category: Category })[]) || [];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {admin.recipes}
          </h1>
          <p className="text-muted-foreground">{admin.recipesSubtitle}</p>
        </div>
        <Button asChild>
          <Link href="/admin/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            {admin.addNew}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">{admin.allRecipesList}</CardTitle>
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
                      <p className="font-medium text-foreground">{recipe.title_en}</p>
                      {recipe.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          {admin.featured}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      {recipe.category && <span>{recipe.category.name_en}</span>}
                      <span>•</span>
                      <span
                        className={
                          recipe.is_published ? 'text-green-600' : 'text-yellow-600'
                        }
                      >
                        {recipe.is_published ? admin.published : admin.draft}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/recipes/${recipe.id}`}>
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
              {admin.noRecipesFound}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
