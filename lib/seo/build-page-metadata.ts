import type { Metadata } from 'next';
import { getSiteOrigin } from './site-url';

function normalizeDocPath(pathname: string): string {
  if (!pathname || pathname === '/') return '';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function absoluteUrl(pathname: string): string | undefined {
  const origin = getSiteOrigin();
  if (!origin) return undefined;
  const path = normalizeDocPath(pathname);
  return `${origin.replace(/\/$/, '')}${path}`;
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
  /** Path from site root (e.g. `/recipes`, `/recipes/adobo`). Use '' for home. */
  pathname: string;
  title: string;
  description?: string | null;
  ogImages?: string[];
  ogType?: 'website' | 'article';
  siteName?: string;
};

export function buildPageMetadata(opts: BuildPageMetadataOptions): Metadata {
  const path = normalizeDocPath(opts.pathname);
  const description = truncateMetaDescription(opts.description);
  const canonical = absoluteUrl(path);
  const siteName = opts.siteName ?? 'Sarap Kitchen';
  const ogImages = (opts.ogImages ?? []).filter(Boolean);

  return {
    title: opts.title,
    description,
    alternates: {
      ...(canonical ? { canonical } : {}),
    },
    openGraph: {
      type: opts.ogType ?? 'website',
      title: opts.title,
      description,
      url: canonical,
      siteName,
      locale: 'en_US',
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
