import { redirect } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryFormDialog } from '@/components/admin/category-form-dialog';
import { DeleteCategoryButton } from '@/components/admin/delete-category-button';
import type { Category } from '@/lib/types/database';

const admin = copy.admin;

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
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
            {admin.categories}
          </h1>
          <p className="text-muted-foreground">{admin.categoriesSubtitle}</p>
        </div>
        <CategoryFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">{admin.allCategoriesList}</CardTitle>
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
                    <p className="font-medium text-foreground">{category.name_en}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.slug_en}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryFormDialog category={category} isEdit />
                    <DeleteCategoryButton categoryId={category.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              {admin.noCategoriesFound}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
