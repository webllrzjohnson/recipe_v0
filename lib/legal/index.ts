import type { LegalPageContent, LegalPageSlug } from './types';
import { legalPagesEn } from './content-en';

export type { LegalPageContent, LegalPageSlug, LegalSection } from './types';
export { legalPageSlugs } from './types';

export function getLegalPage(slug: LegalPageSlug): LegalPageContent {
  const page = legalPagesEn[slug];
  if (!page) {
    throw new Error(`Unknown legal page: ${slug}`);
  }
  return page;
}
