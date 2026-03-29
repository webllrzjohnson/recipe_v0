import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryFormDialog } from '@/components/admin/category-form-dialog';
import { DeleteCategoryButton } from '@/components/admin/delete-category-button';
import type { Category } from '@/lib/types/database';

export default async function AdminCategoriesPage({
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

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name_en', { ascending: true });

  const categories = (categoriesData as Category[]) || [];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t('categories')}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'fr'
              ? 'Gérez vos catégories de recettes'
              : 'Manage your recipe categories'}
          </p>
        </div>
        <CategoryFormDialog locale={locale} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {locale === 'fr' ? 'Toutes les catégories' : 'All Categories'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="divide-y divide-border">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {locale === 'fr' ? category.name_fr : category.name_en}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category.slug_en}
                      {category.slug_fr
                        ? ` · ${category.slug_fr}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryFormDialog
                      locale={locale}
                      category={category}
                      isEdit
                    />
                    <DeleteCategoryButton categoryId={category.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              {locale === 'fr'
                ? 'Aucune catégorie trouvée'
                : 'No categories found'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
