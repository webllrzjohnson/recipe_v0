import type { SupabaseClient } from '@supabase/supabase-js';
import {
  isValidAdsensePublisherId,
  normalizeAdPlacementsJson,
  normalizeAdsensePublisherId,
  type AdPlacementsRecord,
} from '@/lib/ads/placements';

export interface SiteSettingsRow {
  id: number;
  ads_enabled: boolean;
  adsense_publisher_id: string | null;
  adsense_placements: unknown;
  updated_at: string;
}

export interface PublicAdSettings {
  /** True only when ads_enabled, valid publisher id, and at least one enabled placement with slot. */
  adsActive: boolean;
  publisherId: string | null;
  placements: AdPlacementsRecord;
}

export async function fetchPublicAdSettings(
  supabase: SupabaseClient
): Promise<PublicAdSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('ads_enabled, adsense_publisher_id, adsense_placements')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[site_settings]', error.message);
    }
    return {
      adsActive: false,
      publisherId: null,
      placements: normalizeAdPlacementsJson(null),
    };
  }

  if (!data) {
    return {
      adsActive: false,
      publisherId: null,
      placements: normalizeAdPlacementsJson(null),
    };
  }

  const rawPub = data.adsense_publisher_id as string | null | undefined;
  const normalized = rawPub ? normalizeAdsensePublisherId(String(rawPub).trim()) : '';
  const publisherId =
    normalized && isValidAdsensePublisherId(normalized) ? normalized : null;
  const placements = normalizeAdPlacementsJson(data.adsense_placements);
  const adsEnabled = Boolean(data.ads_enabled);
  const hasSlot = Object.values(placements).some((p) => p.enabled && p.slot_id);
  const adsActive = adsEnabled && !!publisherId && hasSlot;

  return {
    adsActive,
    publisherId,
    placements,
  };
}
