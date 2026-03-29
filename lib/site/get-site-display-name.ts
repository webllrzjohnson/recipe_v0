import { cache } from 'react';
import { getSiteAppearance } from '@/lib/site/get-site-appearance';

/** Resolved once per request (via getSiteAppearance cache). */
export const getSiteDisplayName = cache(
  async (): Promise<string> => (await getSiteAppearance()).siteName
);
