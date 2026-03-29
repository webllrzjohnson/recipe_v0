import { redirect, notFound } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { RecipeForm } from '@/components/admin/recipe-form';
import type { Category, Recipe } from '@/lib/types/database';

const admin = copy.admin;

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const [{ data: recipe }, { data: categories }] = await Promise.all([
    supabase.from('recipes').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name_en', { ascending: true }),
  ]);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {admin.editRecipeTitle}
        </h1>
      </div>
      <RecipeForm
        categories={(categories as Category[]) || []}
        recipe={recipe as Recipe}
      />
    </div>
  );
}
