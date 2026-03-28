import { redirect, notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { RecipeForm } from '@/components/admin/recipe-form';
import type { Category, Recipe } from '@/lib/types/database';

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
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
          {locale === 'fr' ? 'Modifier la Recette' : 'Edit Recipe'}
        </h1>
      </div>
      <RecipeForm
        locale={locale}
        categories={(categories as Category[]) || []}
        recipe={recipe as Recipe}
      />
    </div>
  );
}
