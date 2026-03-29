import type { MetadataRoute } from 'next';
import { getSitemapOrigin } from '@/lib/seo/site-url';

export default function robots(): MetadataRoute.Robots {
  const base = getSitemapOrigin().replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/admin/'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ''),
  };
}
