export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalPageContent = {
  title: string;
  description: string;
  sections: LegalSection[];
};

export const legalPageSlugs = [
  'privacy',
  'terms',
  'disclaimer',
  'cookies',
] as const;

export type LegalPageSlug = (typeof legalPageSlugs)[number];
