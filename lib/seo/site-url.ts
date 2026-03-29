/**
 * Canonical site origin for metadata, hreflang, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://example.com).
 */
export function getSiteOrigin(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel)
    return `https://${vercel.replace(/^https?:\/\//i, '')}`.replace(/\/$/, '');
  return undefined;
}

export function getMetadataBase(): URL {
  const origin = getSiteOrigin();
  if (origin) {
    try {
      return new URL(`${origin}/`);
    } catch {
      /* fall through */
    }
  }
  return new URL('http://localhost:3000/');
}

/** Absolute origin for sitemap and robots (never empty; localhost in dev). */
export function getSitemapOrigin(): string {
  return getSiteOrigin() ?? 'http://localhost:3000';
}
