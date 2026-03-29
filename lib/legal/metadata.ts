import { copy } from '@/lib/copy';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import type { LegalPageSlug } from '@/lib/legal';
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
  const content = await resolveLegalPageContentOnly(supabase, slug);

  return buildPageMetadata({
    pathname: PATH_BY_SLUG[slug],
    title: content.title,
    description: content.description,
    siteName: copy.common.siteName,
  });
}
