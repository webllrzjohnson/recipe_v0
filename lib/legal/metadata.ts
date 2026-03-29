import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { getLegalPage, type LegalPageSlug } from '@/lib/legal';
import type { Locale } from '@/i18n/config';

const PATH_BY_SLUG: Record<LegalPageSlug, string> = {
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  cookies: '/cookies',
};

export async function buildLegalMetadata(
  locale: string,
  slug: LegalPageSlug
) {
  const content = getLegalPage(slug, locale as Locale);
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return buildPageMetadata({
    locale,
    pathname: PATH_BY_SLUG[slug],
    title: content.title,
    description: content.description,
    siteName: tCommon('siteName'),
  });
}
