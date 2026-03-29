import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { copy } from '@/lib/copy';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import { normalizeUrlSlug } from '@/lib/supabase/fetch-by-url-slug';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BlogPostBody } from '@/components/blog/blog-post-body';
import { localizeBlogPost } from '@/lib/utils/localize';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import type { BlogPost } from '@/lib/types/database';
import { ArrowLeft } from 'lucide-react';

const common = copy.common;
const blogPage = copy.blogPage;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normalizeUrlSlug(rawSlug);
  const supabase = createAnonServerClient();

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

  const post = localizeBlogPost(row as BlogPost);
  const description =
    post.excerpt?.trim() ||
    post.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);

  return buildPageMetadata({
    pathname: `/blog/${slug}`,
    title: post.title,
    description,
    ogImages: post.image_url?.trim() ? [post.image_url.trim()] : undefined,
    ogType: 'article',
    siteName: common.siteName,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normalizeUrlSlug(rawSlug);

  const supabase = createAnonServerClient();

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

  const post = localizeBlogPost(row as BlogPost);
  const dateRaw = row.published_at || row.created_at;
  const dateLabel = dateRaw
    ? new Intl.DateTimeFormat('en-CA', {
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
              {blogPage.backToBlog}
            </Link>

            <header className="mb-8 text-center sm:text-left">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {post.title}
              </h1>
              {dateLabel ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {blogPage.publishedOn.replace('{date}', dateLabel)}
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
                  loading="eager"
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
