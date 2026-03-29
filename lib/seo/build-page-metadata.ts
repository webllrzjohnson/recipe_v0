import type { Metadata } from 'next';
import { defaultLocale, locales, type Locale } from '@/i18n/config';
import { getSiteOrigin } from './site-url';

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
};

function normalizeDocPath(pathname: string): string {
  if (!pathname || pathname === '/') return '';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function absoluteUrlForLocale(
  locale: string,
  pathname: string
): string | undefined {
  const origin = getSiteOrigin();
  if (!origin) return undefined;
  const path = normalizeDocPath(pathname);
  return `${origin}/${locale}${path}`;
}

export function hreflangAlternates(pathname: string): Record<string, string> {
  const origin = getSiteOrigin();
  const path = normalizeDocPath(pathname);
  const entries: Record<string, string> = {};

  for (const loc of locales) {
    const relative = `/${loc}${path}`;
    entries[loc] = origin ? `${origin}${relative}` : relative;
  }
  const defaultRel = `/${defaultLocale}${path}`;
  entries['x-default'] = origin ? `${origin}${defaultRel}` : defaultRel;
  return entries;
}

/** hreflang when each locale has its own path (e.g. different slugs). Skips locales with no path. */
export function hreflangAlternatesFromPaths(
  pathByLocale: Partial<Record<Locale, string>>
): Record<string, string> {
  const origin = getSiteOrigin();
  const entries: Record<string, string> = {};

  for (const loc of locales) {
    const raw = pathByLocale[loc];
    if (!raw?.trim()) continue;
    const norm = normalizeDocPath(raw);
    const relative = `/${loc}${norm}`;
    entries[loc] = origin ? `${origin}${relative}` : relative;
  }

  const defaultPath = pathByLocale[defaultLocale]?.trim();
  if (defaultPath) {
    const norm = normalizeDocPath(defaultPath);
    const defaultRel = `/${defaultLocale}${norm}`;
    entries['x-default'] = origin ? `${origin}${defaultRel}` : defaultRel;
  }

  return entries;
}

export function truncateMetaDescription(
  text: string | null | undefined,
  max = 160
): string | undefined {
  const t = text?.trim();
  if (!t) return undefined;
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export type BuildPageMetadataOptions = {
  locale: string;
  /** Path after locale (e.g. `/recipes`, `/recipes/adobo`). Use '' for home. */
  pathname: string;
  title: string;
  description?: string | null;
  ogImages?: string[];
  ogType?: 'website' | 'article';
  siteName?: string;
  /** If set, hreflang uses these per-locale paths instead of repeating `pathname`. */
  alternatePathnames?: Partial<Record<Locale, string>>;
};

export function buildPageMetadata(opts: BuildPageMetadataOptions): Metadata {
  const locale = opts.locale as Locale;
  const path = normalizeDocPath(opts.pathname);
  const description = truncateMetaDescription(opts.description);
  const canonical = absoluteUrlForLocale(locale, path);
  const siteName = opts.siteName ?? 'Sarap Kitchen';
  const ogImages = (opts.ogImages ?? []).filter(Boolean);
  const ogLocale = OG_LOCALE[locale] ?? OG_LOCALE.en;
  const alternateLocales = locales
    .filter((l) => l !== locale)
    .map((l) => OG_LOCALE[l]);

  const languages = opts.alternatePathnames
    ? hreflangAlternatesFromPaths(opts.alternatePathnames)
    : hreflangAlternates(path);

  return {
    title: opts.title,
    description,
    alternates: {
      ...(canonical ? { canonical } : {}),
      languages,
    },
    openGraph: {
      type: opts.ogType ?? 'website',
      title: opts.title,
      description,
      url: canonical,
      siteName,
      locale: ogLocale,
      alternateLocale: alternateLocales,
      ...(ogImages.length ? { images: ogImages.map((url) => ({ url })) } : {}),
    },
    twitter: {
      card: ogImages.length ? 'summary_large_image' : 'summary',
      title: opts.title,
      description,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
  };
}
