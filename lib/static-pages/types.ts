import type { LegalPageContent, LegalPageSlug } from '@/lib/legal/types';

export const STATIC_PAGE_SLUGS = [
  'home',
  'about',
  'privacy',
  'terms',
  'disclaimer',
  'cookies',
] as const;

export type StaticPageSlug = (typeof STATIC_PAGE_SLUGS)[number];

export function isStaticPageSlug(s: string): s is StaticPageSlug {
  return (STATIC_PAGE_SLUGS as readonly string[]).includes(s);
}

export type AboutValueCard = {
  title: string;
  description: string;
};

/** Stored in static_pages.content for slug = home */
export type HomePageStoredContent = {
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  exploreRecipesLabel: string;
  blogLabel: string;
  heroImageUrl: string;
  heroImageAlt: string;
};

/** Stored in static_pages.content for slug = about */
export type AboutPageStoredContent = {
  title: string;
  subtitle: string;
  storyHeading: string;
  storyText: string;
  missionHeading: string;
  missionText: string;
  valuesHeading: string;
  values: AboutValueCard[];
  storyImageUrl: string;
  missionImageUrl: string;
};

/** Stored for legal slugs — same shape as LegalPageContent */
export type LegalPageStoredContent = LegalPageContent;

export type { LegalPageContent, LegalPageSlug };
