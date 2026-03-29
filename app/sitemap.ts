import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getSitemapOrigin } from '@/lib/seo/site-url';
import { createAnonServerClient } from '@/lib/supabase/anon-server';

/** Refresh sitemap periodically so new recipes/categories appear without redeploying. */
export const revalidate = 3600;

function lastMod(
  row: { updated_at?: string | null; created_at?: string | null }
): Date {
  const raw = row.updated_at || row.created_at;
  if (raw) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSitemapOrigin().replace(/\/$/, '');
  const supabase = createAnonServerClient();

  const [recipesRes, categoriesRes, blogRes] = await Promise.all([
    supabase
      .from('recipes')
      .select('slug_en, slug_fr, updated_at, created_at')
      .eq('is_published', true),
    supabase
      .from('categories')
      .select('slug_en, slug_fr, updated_at, created_at'),
    supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at')
      .eq('is_published', true),
  ]);

  const recipes = recipesRes.data ?? [];
  const categories = categoriesRes.data ?? [];
  const blogPosts = blogRes.data ?? [];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = `${base}/${locale}`;

    entries.push({
      url: `${prefix}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    entries.push({
      url: `${prefix}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    entries.push({
      url: `${prefix}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });

    entries.push({
      url: `${prefix}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });

    for (const legalPath of ['/privacy', '/terms', '/disclaimer', '/cookies']) {
      entries.push({
        url: `${prefix}${legalPath}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.35,
      });
    }

    entries.push({
      url: `${prefix}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    });

    for (const post of blogPosts) {
      const slug = post.slug?.trim();
      if (!slug) continue;
      entries.push({
        url: `${prefix}/blog/${slug}`,
        lastModified: lastMod(post),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    for (const cat of categories) {
      const pathSlug =
        locale === 'fr'
          ? cat.slug_fr?.trim() || cat.slug_en
          : cat.slug_en;
      if (!pathSlug?.trim()) continue;
      entries.push({
        url: `${prefix}/categories/${pathSlug.trim()}`,
        lastModified: lastMod(cat),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    for (const recipe of recipes) {
      const pathSlug =
        locale === 'fr'
          ? recipe.slug_fr?.trim() || recipe.slug_en
          : recipe.slug_en;
      if (!pathSlug?.trim()) continue;
      entries.push({
        url: `${prefix}/recipes/${pathSlug.trim()}`,
        lastModified: lastMod(recipe),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  return entries;
}
