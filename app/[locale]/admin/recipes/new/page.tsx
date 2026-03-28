import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { RecipeForm } from '@/components/admin/recipe-form';
import type { Category } from '@/lib/types/database';

export default async function NewRecipePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name_en', { ascending: true });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {locale === 'fr' ? 'Nouvelle Recette' : 'New Recipe'}
        </h1>
      </div>
      <RecipeForm
        locale={locale}
        categories={(categories as Category[]) || []}
      />
    </div>
  );
}
