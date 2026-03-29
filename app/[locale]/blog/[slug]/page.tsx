import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BlogPostBody } from '@/components/blog/blog-post-body';
import { Link } from '@/i18n/navigation';
import { localizeBlogPost } from '@/lib/utils/localize';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import type { Locale } from '@/i18n/config';
import type { BlogPost } from '@/lib/types/database';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const { data: row } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!row) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  const post = localizeBlogPost(row as BlogPost, locale as Locale);
  const description =
    post.excerpt?.trim() ||
    post.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);

  const pathByLocale: Partial<Record<Locale, string>> = {
    en: `/blog/${slug}`,
    fr: `/blog/${slug}`,
  };

  return buildPageMetadata({
    locale,
    pathname: `/blog/${slug}`,
    title: post.title,
    description,
    ogImages: post.image_url?.trim() ? [post.image_url.trim()] : undefined,
    ogType: 'article',
    siteName: tCommon('siteName'),
    alternatePathnames: pathByLocale,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blogPage' });

  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error && process.env.NODE_ENV === 'development') {
    console.error('[blog post]', error.message);
  }

  if (!row) {
    notFound();
  }

  const post = localizeBlogPost(row as BlogPost, locale as Locale);
  const dateRaw = row.published_at || row.created_at;
  const dateLabel = dateRaw
    ? new Intl.DateTimeFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
        dateStyle: 'medium',
      }).format(new Date(dateRaw))
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="py-10 sm:py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToBlog')}
            </Link>

            <header className="mb-8 text-center sm:text-left">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {post.title}
              </h1>
              {dateLabel ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('publishedOn', { date: dateLabel })}
                </p>
              ) : null}
            </header>

            {post.image_url ? (
              <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-sm border border-border">
                <Image
                  src={post.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 720px"
                  priority
                />
              </div>
            ) : null}

            <BlogPostBody
              html={post.content}
              className="blog-post-content recipe-blog-content max-w-none text-left"
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
