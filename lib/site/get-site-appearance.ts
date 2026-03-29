import { cache } from 'react';
import { copy } from '@/lib/copy';
import { createAnonServerClient } from '@/lib/supabase/anon-server';
import {
  buildThemeStyleTag,
  DEFAULT_COLOR_SCHEME,
  DEFAULT_FONT_PAIR,
  normalizeColorSchemeKey,
  normalizeFontPairKey,
} from '@/lib/site/theme-presets';

export type SiteAppearance = {
  siteName: string;
  siteTagline: string;
  colorScheme: string;
  fontPair: string;
  faviconUrl: string | null;
  injectedThemeCss: string;
  googleFontsHref: string;
};

export const getSiteAppearance = cache(async (): Promise<SiteAppearance> => {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('site_name, site_tagline, color_scheme, font_pair, favicon_url')
    .eq('id', 1)
    .maybeSingle();

  const nameFb = copy.common.siteName?.trim() || 'Site';
  const tagFb = copy.common.tagline?.trim() || '';

  if (error || !data) {
    const { css, googleHref } = buildThemeStyleTag(
      DEFAULT_COLOR_SCHEME,
      DEFAULT_FONT_PAIR
    );
    return {
      siteName: nameFb,
      siteTagline: tagFb,
      colorScheme: DEFAULT_COLOR_SCHEME,
      fontPair: DEFAULT_FONT_PAIR,
      faviconUrl: null,
      injectedThemeCss: css,
      googleFontsHref: googleHref,
    };
  }

  const row = data as {
    site_name?: string | null;
    site_tagline?: string | null;
    color_scheme?: string | null;
    font_pair?: string | null;
    favicon_url?: string | null;
  };

  const colorKey = normalizeColorSchemeKey(row.color_scheme);
  const fontKey = normalizeFontPairKey(row.font_pair);
  const { css, googleHref } = buildThemeStyleTag(colorKey, fontKey);

  return {
    siteName:
      typeof row.site_name === 'string' && row.site_name.trim()
        ? row.site_name.trim()
        : nameFb,
    siteTagline:
      typeof row.site_tagline === 'string' && row.site_tagline.trim()
        ? row.site_tagline.trim()
        : tagFb,
    colorScheme: colorKey,
    fontPair: fontKey,
    faviconUrl:
      typeof row.favicon_url === 'string' && row.favicon_url.trim()
        ? row.favicon_url.trim()
        : null,
    injectedThemeCss: css,
    googleFontsHref: googleHref,
  };
});

export const getSiteBrand = cache(async () => {
  const a = await getSiteAppearance();
  return { siteName: a.siteName, siteTagline: a.siteTagline };
});
