import type { SupabaseClient } from '@supabase/supabase-js';
import { getLegalPage } from '@/lib/legal';
import type { LegalPageContent, LegalPageSlug } from '@/lib/legal/types';
import { SITE_LOCALE } from '@/lib/site-locale';
import { getAboutFallback } from '@/lib/static-pages/about-fallback';
import { getHomeFallback } from '@/lib/static-pages/home-fallback';
import { formatStaticPageUpdatedAt } from '@/lib/static-pages/format-updated';
import {
  parseAboutPageContent,
  parseHomePageContent,
  parseLegalPageContent,
} from '@/lib/static-pages/parse';
import type { AboutPageStoredContent, HomePageStoredContent, StaticPageSlug } from '@/lib/static-pages/types';

export async function fetchStaticPageRow(
  supabase: SupabaseClient,
  slug: StaticPageSlug
) {
  return supabase
    .from('static_pages')
    .select('content, updated_at')
    .eq('page_slug', slug)
    .eq('locale', SITE_LOCALE)
    .maybeSingle();
}

export async function resolveHomeHero(
  supabase: SupabaseClient
): Promise<HomePageStoredContent> {
  const { data, error } = await fetchStaticPageRow(supabase, 'home');
  if (error && process.env.NODE_ENV === 'development') {
    console.error('[static_pages home]', error.message);
  }
  if (data?.content) {
    const parsed = parseHomePageContent(data.content);
    if (parsed) return parsed;
  }
  return getHomeFallback();
}

export async function resolveAboutPage(
  supabase: SupabaseClient
): Promise<AboutPageStoredContent> {
  const { data, error } = await fetchStaticPageRow(supabase, 'about');
  if (error && process.env.NODE_ENV === 'development') {
    console.error('[static_pages about]', error.message);
  }
  if (data?.content) {
    const parsed = parseAboutPageContent(data.content);
    if (parsed) return parsed;
  }
  return getAboutFallback();
}

export async function resolveLegalPageContentOnly(
  supabase: SupabaseClient,
  slug: LegalPageSlug
): Promise<LegalPageContent> {
  const { data, error } = await fetchStaticPageRow(supabase, slug as StaticPageSlug);
  if (error && process.env.NODE_ENV === 'development') {
    console.error('[static_pages legal]', error.message);
  }
  if (data?.content) {
    const parsed = parseLegalPageContent(data.content);
    if (parsed) return parsed;
  }
  return getLegalPage(slug);
}

export async function resolveLegalPageForPublic(
  supabase: SupabaseClient,
  slug: LegalPageSlug,
  fallbackLastUpdatedLabel: string
): Promise<{ content: LegalPageContent; lastUpdated: string }> {
  const { data, error } = await fetchStaticPageRow(supabase, slug as StaticPageSlug);
  if (error && process.env.NODE_ENV === 'development') {
    console.error('[static_pages legal]', error.message);
  }
  const fallback = getLegalPage(slug);
  if (data?.content) {
    const parsed = parseLegalPageContent(data.content);
    if (parsed) {
      return {
        content: parsed,
        lastUpdated:
          formatStaticPageUpdatedAt(data.updated_at) || fallbackLastUpdatedLabel,
      };
    }
  }
  return { content: fallback, lastUpdated: fallbackLastUpdatedLabel };
}
