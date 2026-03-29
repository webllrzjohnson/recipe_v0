import type { LegalPageContent } from '@/lib/legal/types';
import { getHomeFallback } from '@/lib/static-pages/home-fallback';
import type { AboutPageStoredContent, HomePageStoredContent } from '@/lib/static-pages/types';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export function parseLegalPageContent(raw: unknown): LegalPageContent | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (!isNonEmptyString(o.title) || !isNonEmptyString(o.description) || !Array.isArray(o.sections)) {
    return null;
  }
  const sections: LegalPageContent['sections'] = [];
  for (const s of o.sections) {
    if (!s || typeof s !== 'object') return null;
    const sec = s as Record<string, unknown>;
    if (!isNonEmptyString(sec.title) || !Array.isArray(sec.paragraphs)) return null;
    const paragraphs: string[] = [];
    for (const p of sec.paragraphs) {
      if (typeof p !== 'string') return null;
      paragraphs.push(p);
    }
    if (paragraphs.length === 0) return null;
    sections.push({ title: sec.title.trim(), paragraphs });
  }
  if (sections.length === 0) return null;
  return {
    title: o.title.trim(),
    description: String(o.description).trim(),
    sections,
  };
}

export function parseHomePageContent(raw: unknown): HomePageStoredContent | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const fields = [
    o.tagline,
    o.heroTitle,
    o.heroSubtitle,
    o.exploreRecipesLabel,
    o.heroImageUrl,
    o.heroImageAlt,
  ];
  if (!fields.every(isNonEmptyString)) return null;
  const fallback = getHomeFallback();
  const blogLabel = isNonEmptyString(o.blogLabel) ? o.blogLabel.trim() : fallback.blogLabel;
  return {
    tagline: (o.tagline as string).trim(),
    heroTitle: (o.heroTitle as string).trim(),
    heroSubtitle: String(o.heroSubtitle).trim(),
    exploreRecipesLabel: (o.exploreRecipesLabel as string).trim(),
    blogLabel,
    heroImageUrl: (o.heroImageUrl as string).trim(),
    heroImageAlt: String(o.heroImageAlt).trim(),
  };
}

export function parseAboutPageContent(raw: unknown): AboutPageStoredContent | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const strings = [
    o.title,
    o.subtitle,
    o.storyHeading,
    o.storyText,
    o.missionHeading,
    o.missionText,
    o.valuesHeading,
  ];
  if (!strings.every(isNonEmptyString)) return null;
  if (!Array.isArray(o.values) || o.values.length === 0) return null;
  const values: AboutPageStoredContent['values'] = [];
  for (const v of o.values) {
    if (!v || typeof v !== 'object') return null;
    const vc = v as Record<string, unknown>;
    if (!isNonEmptyString(vc.title) || !isNonEmptyString(vc.description)) return null;
    values.push({ title: vc.title.trim(), description: vc.description.trim() });
  }
  const storyImageUrl =
    typeof o.storyImageUrl === 'string' && o.storyImageUrl.trim()
      ? o.storyImageUrl.trim()
      : ABOUT_IMAGE_DEFAULTS.story;
  const missionImageUrl =
    typeof o.missionImageUrl === 'string' && o.missionImageUrl.trim()
      ? o.missionImageUrl.trim()
      : ABOUT_IMAGE_DEFAULTS.mission;

  return {
    title: (o.title as string).trim(),
    subtitle: String(o.subtitle).trim(),
    storyHeading: (o.storyHeading as string).trim(),
    storyText: String(o.storyText).trim(),
    missionHeading: (o.missionHeading as string).trim(),
    missionText: String(o.missionText).trim(),
    valuesHeading: (o.valuesHeading as string).trim(),
    values,
    storyImageUrl,
    missionImageUrl,
  };
}

const ABOUT_IMAGE_DEFAULTS = {
  story: 'https://placehold.co/800x600/C0392B/FFFFFF?text=Our+Kitchen',
  mission: 'https://placehold.co/800x600/F39C12/FFFFFF?text=Cooking+Together',
};
