import Link from 'next/link';
import { redirect } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { STATIC_PAGE_SLUGS, type StaticPageSlug } from '@/lib/static-pages/types';
import { publicPathForStaticSlug } from '@/lib/static-pages/paths';

const pagesCopy = copy.admin.pages;
const admin = copy.admin;

export default async function AdminStaticPagesListPage() {
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">{pagesCopy.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{pagesCopy.intro}</p>
      </div>

      <div className="grid max-w-xl gap-4">
        {STATIC_PAGE_SLUGS.map((slug: StaticPageSlug) => {
          const label =
            pagesCopy[
              slug as keyof Pick<
                typeof pagesCopy,
                'home' | 'about' | 'privacy' | 'terms' | 'disclaimer' | 'cookies'
              >
            ];
          const path = publicPathForStaticSlug(slug);
          return (
            <Card key={slug}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">{label}</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href={path} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-3.5 w-3.5" />
                    {pagesCopy.preview}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={`/admin/pages/${slug}`}>{admin.edit}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
