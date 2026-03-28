import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, FolderOpen, FileText } from 'lucide-react';

export default async function AdminDashboardPage({
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

  // Check if user is admin
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect(`/${locale}/admin/login`);
  }

  // Fetch stats
  const [
    { count: recipesCount },
    { count: categoriesCount },
    { count: postsCount },
  ] = await Promise.all([
    supabase.from('recipes').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    {
      title: t('totalRecipes'),
      value: recipesCount || 0,
      icon: UtensilsCrossed,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: t('totalCategories'),
      value: categoriesCount || 0,
      icon: FolderOpen,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      title: t('totalPosts'),
      value: postsCount || 0,
      icon: FileText,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
    },
  ];

  // Fetch recent recipes
  const { data: recentRecipes } = await supabase
    .from('recipes')
    .select('id, title_en, title_fr, is_published, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {t('dashboard')}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'fr'
            ? 'Bienvenue dans le panneau d\'administration'
            : 'Welcome to the admin dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">{t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRecipes && recentRecipes.length > 0 ? (
            <div className="space-y-3">
              {recentRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {locale === 'fr' ? recipe.title_fr : recipe.title_en}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(recipe.created_at).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      recipe.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {recipe.is_published ? t('published') : t('draft')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {locale === 'fr' ? 'Aucune activité récente' : 'No recent activity'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
