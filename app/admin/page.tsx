import { redirect } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, FolderOpen, FileText } from 'lucide-react';

const admin = copy.admin;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/admin/login');
  }

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
      title: admin.totalRecipes,
      value: recipesCount || 0,
      icon: UtensilsCrossed,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: admin.totalCategories,
      value: categoriesCount || 0,
      icon: FolderOpen,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      title: admin.totalPosts,
      value: postsCount || 0,
      icon: FileText,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
    },
  ];

  const { data: recentRecipes } = await supabase
    .from('recipes')
    .select('id, title_en, title_fr, is_published, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {admin.dashboard}
        </h1>
        <p className="text-muted-foreground">{admin.dashboardWelcome}</p>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">{admin.recentActivity}</CardTitle>
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
                    <p className="font-medium text-foreground">{recipe.title_en}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(recipe.created_at).toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      recipe.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {recipe.is_published ? admin.published : admin.draft}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">{admin.noRecentActivity}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
