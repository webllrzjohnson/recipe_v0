import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Home, ExternalLink } from 'lucide-react';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { StaticAboutEditor } from '@/components/admin/static-about-editor';
import { StaticHomeEditor } from '@/components/admin/static-home-editor';
import { StaticLegalEditor } from '@/components/admin/static-legal-editor';
import type { LegalPageSlug } from '@/lib/legal/types';
import { publicPathForStaticSlug } from '@/lib/static-pages/paths';
import { isStaticPageSlug, type StaticPageSlug } from '@/lib/static-pages/types';
import {
  resolveAboutPage,
  resolveHomeHero,
  resolveLegalPageContentOnly,
} from '@/lib/static-pages/resolve';

const pagesCopy = copy.admin.pages;
const admin = copy.admin;

export default async function AdminEditStaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;

  if (!isStaticPageSlug(rawSlug)) {
    notFound();
  }

  const slug = rawSlug as StaticPageSlug;

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

  const path = publicPathForStaticSlug(slug);
  type PageNavKey = 'home' | 'about' | 'privacy' | 'terms' | 'disclaimer' | 'cookies';
  const pageTitle =
    pagesCopy[slug as keyof Pick<typeof pagesCopy, PageNavKey>];

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            {admin.goHome}
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={path} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            {pagesCopy.preview}
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">{pageTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{pagesCopy.editHint}</p>
      </div>

      {slug === 'about' ? (
        <StaticAboutEditor initialContent={await resolveAboutPage(supabase)} />
      ) : slug === 'home' ? (
        <StaticHomeEditor initialContent={await resolveHomeHero(supabase)} />
      ) : (
        <StaticLegalEditor
          pageSlug={slug as LegalPageSlug}
          initialContent={await resolveLegalPageContentOnly(
            supabase,
            slug as LegalPageSlug
          )}
        />
      )}
    </div>
  );
}
