import { copy } from '@/lib/copy';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BlogCard } from '@/components/blog/blog-card';
import { localizeBlogPost } from '@/lib/utils/localize';
import type { BlogPost } from '@/lib/types/database';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { getSiteBrand } from '@/lib/site/get-site-appearance';

const common = copy.common;
const seo = copy.seo;
const blogPage = copy.blogPage;

export async function generateMetadata() {
  const { siteName } = await getSiteBrand();
  return buildPageMetadata({
    pathname: '/blog',
    title: common.blog,
    description: seo.blogListingDescription,
    siteName,
  });
}

export default async function BlogIndexPage() {
  const supabase = createAnonServerClient();

  const [{ data: rows, error }, { siteName, siteTagline }] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false }),
    getSiteBrand(),
  ]);

  if (error && process.env.NODE_ENV === 'development') {
    console.error('[blog index]', error.message);
  }

  const posts =
    (rows as BlogPost[] | null)?.map((row) => localizeBlogPost(row)) ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} siteTagline={siteTagline} />
      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {common.blog}
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">{blogPage.intro}</p>
            </div>

            {posts.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} priority={index < 3} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">{common.noResults}</p>
            )}
          </div>
        </section>
      </main>
      <Footer siteName={siteName} siteTagline={siteTagline} />
    </div>
  );
}
