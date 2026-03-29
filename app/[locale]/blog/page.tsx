import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BlogCard } from '@/components/blog/blog-card';
import { localizeBlogPost } from '@/lib/utils/localize';
import type { Locale } from '@/i18n/config';
import type { BlogPost } from '@/lib/types/database';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  const tSeo = await getTranslations({ locale, namespace: 'seo' });

  return buildPageMetadata({
    locale,
    pathname: '/blog',
    title: t('blog'),
    description: tSeo('blogListingDescription'),
    siteName: t('siteName'),
  });
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blogPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error && process.env.NODE_ENV === 'development') {
    console.error('[blog index]', error.message);
  }

  const posts = (rows as BlogPost[] | null)?.map((row) =>
    localizeBlogPost(row, locale as Locale)
  ) ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {tCommon('blog')}
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">{t('intro')}</p>
            </div>

            {posts.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                {tCommon('noResults')}
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
