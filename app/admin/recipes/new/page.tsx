import { redirect } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { RecipeForm } from '@/components/admin/recipe-form';
import type { Category } from '@/lib/types/database';

const admin = copy.admin;

export default async function NewRecipePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name_en', { ascending: true });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {admin.newRecipeTitle}
        </h1>
      </div>
      <RecipeForm categories={(categories as Category[]) || []} />
    </div>
  );
}
