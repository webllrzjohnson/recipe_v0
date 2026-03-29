import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getSitemapOrigin } from '@/lib/seo/site-url';

export default function robots(): MetadataRoute.Robots {
  const base = getSitemapOrigin().replace(/\/$/, '');

  const adminPaths = locales.flatMap((loc) => [
    `/${loc}/admin`,
    `/${loc}/admin/`,
  ]);

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', ...adminPaths],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ''),
  };
}
