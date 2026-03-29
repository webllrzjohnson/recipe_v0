import { redirect } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { SiteBrandingForm } from '@/components/admin/site-branding-form';
import {
  DEFAULT_COLOR_SCHEME,
  DEFAULT_FONT_PAIR,
  normalizeColorSchemeKey,
  normalizeFontPairKey,
} from '@/lib/site/theme-presets';

const branding = copy.admin.siteBranding;
const fallbackName = copy.common.siteName;
const fallbackTagline = copy.common.tagline;

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/admin/login');
  }

  const { data: row, error } = await supabase
    .from('site_settings')
    .select('site_name, site_tagline, color_scheme, font_pair, favicon_url')
    .eq('id', 1)
    .maybeSingle();

  const r = row as {
    site_name?: string | null;
    site_tagline?: string | null;
    color_scheme?: string | null;
    font_pair?: string | null;
    favicon_url?: string | null;
  } | null;

  const initial = {
    siteName:
      typeof r?.site_name === 'string' && r.site_name.trim()
        ? r.site_name.trim()
        : fallbackName,
    siteTagline: typeof r?.site_tagline === 'string' ? r.site_tagline : fallbackTagline,
    colorScheme: normalizeColorSchemeKey(r?.color_scheme ?? null),
    fontPair: normalizeFontPairKey(r?.font_pair ?? null),
    faviconUrl:
      typeof r?.favicon_url === 'string' && r.favicon_url.trim()
        ? r.favicon_url.trim()
        : null,
  };

  if (!r && !error) {
    initial.colorScheme = DEFAULT_COLOR_SCHEME;
    initial.fontPair = DEFAULT_FONT_PAIR;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">{branding.pageTitle}</h1>
        <p className="text-muted-foreground">{branding.pageDescription}</p>
      </div>
      <SiteBrandingForm initial={initial} loadError={Boolean(error)} />
    </div>
  );
}
