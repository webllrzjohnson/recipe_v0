/** Keys stored in site_settings.adsense_placements — keep stable for DB JSON. */
export const AD_PLACEMENT_KEYS = [
  'below_header',
  'recipe_after_intro',
  'recipe_between_sections',
  'above_footer',
] as const;

export type AdPlacementKey = (typeof AD_PLACEMENT_KEYS)[number];

export interface AdPlacementConfig {
  enabled: boolean;
  slot_id: string;
}

export type AdPlacementsRecord = Record<AdPlacementKey, AdPlacementConfig>;

const EMPTY: AdPlacementConfig = { enabled: false, slot_id: '' };

export function defaultAdPlacementsRecord(): AdPlacementsRecord {
  return {
    below_header: { ...EMPTY },
    recipe_after_intro: { ...EMPTY },
    recipe_between_sections: { ...EMPTY },
    above_footer: { ...EMPTY },
  };
}

export function normalizeAdPlacementsJson(raw: unknown): AdPlacementsRecord {
  const base = defaultAdPlacementsRecord();
  if (raw === null || typeof raw !== 'object') return base;
  const o = raw as Record<string, unknown>;
  for (const key of AD_PLACEMENT_KEYS) {
    const v = o[key];
    if (v && typeof v === 'object') {
      const slot = String((v as { slot_id?: unknown }).slot_id ?? '').trim();
      const wantsOn = Boolean((v as { enabled?: unknown }).enabled);
      const enabled = wantsOn && isValidAdsenseSlotId(slot);
      base[key] = { enabled, slot_id: slot };
    }
  }
  return base;
}

export function countEnabledPlacements(p: AdPlacementsRecord): number {
  return AD_PLACEMENT_KEYS.filter((k) => p[k].enabled).length;
}

/** ca-pub-xxxxxxxxxxxxxxxx */
export function normalizeAdsensePublisherId(input: string): string {
  const t = input.trim().toLowerCase();
  if (!t) return '';
  if (t.startsWith('ca-pub-')) return t;
  if (/^\d+$/.test(t)) return `ca-pub-${t}`;
  return t;
}

export function isValidAdsensePublisherId(id: string): boolean {
  return /^ca-pub-\d{10,20}$/.test(id.trim().toLowerCase());
}

export function isValidAdsenseSlotId(slot: string): boolean {
  const s = slot.trim();
  return /^\d{6,20}$/.test(s);
}
