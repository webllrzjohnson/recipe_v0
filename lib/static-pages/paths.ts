import type { StaticPageSlug } from '@/lib/static-pages/types';

export function publicPathForStaticSlug(slug: StaticPageSlug): `/${string}` {
  if (slug === 'home') return '/';
  if (slug === 'about') return '/about';
  return `/${slug}`;
}
