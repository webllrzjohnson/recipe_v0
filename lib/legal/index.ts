import type { Locale } from '@/i18n/config';
import type { LegalPageContent, LegalPageSlug } from './types';
import { legalPagesEn } from './content-en';
import { legalPagesFr } from './content-fr';

export type { LegalPageContent, LegalPageSlug, LegalSection } from './types';
export { legalPageSlugs } from './types';

export function getLegalPage(
  slug: LegalPageSlug,
  locale: Locale
): LegalPageContent {
  const bundle = locale === 'fr' ? legalPagesFr : legalPagesEn;
  const page = bundle[slug];
  if (!page) {
    throw new Error(`Unknown legal page: ${slug}`);
  }
  return page;
}
