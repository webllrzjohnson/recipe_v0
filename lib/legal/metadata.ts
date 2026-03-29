import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import type { LegalPageSlug } from '@/lib/legal';
import { getSiteDisplayName } from '@/lib/site/get-site-display-name';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import { resolveLegalPageContentOnly } from '@/lib/static-pages/resolve';

const PATH_BY_SLUG: Record<LegalPageSlug, string> = {
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  cookies: '/cookies',
};

export async function buildLegalMetadata(slug: LegalPageSlug) {
  const supabase = createAnonServerClient();
  const [content, siteName] = await Promise.all([
    resolveLegalPageContentOnly(supabase, slug),
    getSiteDisplayName(),
  ]);

  return buildPageMetadata({
    pathname: PATH_BY_SLUG[slug],
    title: content.title,
    description: content.description,
    siteName,
  });
}
