'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/client';
import {
  AD_PLACEMENT_KEYS,
  countEnabledPlacements,
  defaultAdPlacementsRecord,
  isValidAdsensePublisherId,
  isValidAdsenseSlotId,
  normalizeAdPlacementsJson,
  normalizeAdsensePublisherId,
  type AdPlacementKey,
  type AdPlacementsRecord,
} from '@/lib/ads/placements';
import type { SiteSettings } from '@/lib/types/database';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, ExternalLink } from 'lucide-react';

const PLACEMENT_TITLE_KEY: Record<
  AdPlacementKey,
  | 'placementBelowHeader'
  | 'placementAfterIntro'
  | 'placementBetweenSections'
  | 'placementAboveFooter'
> = {
  below_header: 'placementBelowHeader',
  recipe_after_intro: 'placementAfterIntro',
  recipe_between_sections: 'placementBetweenSections',
  above_footer: 'placementAboveFooter',
};

function placementsToFormState(p: AdPlacementsRecord): Record<AdPlacementKey, { on: boolean; slot: string }> {
  const o = {} as Record<AdPlacementKey, { on: boolean; slot: string }>;
  for (const key of AD_PLACEMENT_KEYS) {
    o[key] = { on: p[key].enabled, slot: p[key].slot_id };
  }
  return o;
}

interface AdsSettingsFormProps {
  initialRow: SiteSettings | null;
  loadError?: boolean;
}

const adsCopy = copy.admin.ads;
const admin = copy.admin;

export function AdsSettingsForm({ initialRow, loadError }: AdsSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<'saved' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialPlacements = normalizeAdPlacementsJson(initialRow?.adsense_placements ?? null);
  const initialPublisher = initialRow?.adsense_publisher_id
    ? normalizeAdsensePublisherId(String(initialRow.adsense_publisher_id))
    : '';

  const [adsEnabled, setAdsEnabled] = useState(Boolean(initialRow?.ads_enabled));
  const [publisherId, setPublisherId] = useState(initialPublisher);
  const [placementForm, setPlacementForm] = useState(() => placementsToFormState(initialPlacements));

  const enabledCount = useMemo(
    () =>
      countEnabledPlacements(
        AD_PLACEMENT_KEYS.reduce((acc, key) => {
          const row = placementForm[key];
          acc[key] = {
            enabled: row.on && row.slot.trim().length > 0,
            slot_id: row.slot.trim(),
          };
          return acc;
        }, defaultAdPlacementsRecord())
      ),
    [placementForm]
  );

  const setPlacement = (key: AdPlacementKey, patch: Partial<{ on: boolean; slot: string }>) => {
    setPlacementForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const handleSave = async () => {
    setMessage(null);
    setErrorMessage(null);
    const pubNorm = normalizeAdsensePublisherId(publisherId);
    if (adsEnabled && !isValidAdsensePublisherId(pubNorm)) {
      setErrorMessage(adsCopy.invalidPublisher);
      return;
    }

    const placements: AdPlacementsRecord = defaultAdPlacementsRecord();
    for (const key of AD_PLACEMENT_KEYS) {
      const row = placementForm[key];
      const slot = row.slot.trim();
      const on = row.on && slot.length > 0;
      if (on && !isValidAdsenseSlotId(slot)) {
        setErrorMessage(adsCopy.invalidSlot);
        return;
      }
      placements[key] = { enabled: on, slot_id: slot };
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('site_settings').upsert(
      {
        id: 1,
        ads_enabled: adsEnabled,
        adsense_publisher_id: adsEnabled && pubNorm ? pubNorm : null,
        adsense_placements: placements as unknown as SiteSettings['adsense_placements'],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    setLoading(false);

    if (error) {
      setErrorMessage(adsCopy.saveError);
      return;
    }
    setMessage('saved');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {loadError ? (
        <Alert variant="destructive">
          <AlertTitle>{adsCopy.loadErrorTitle}</AlertTitle>
          <AlertDescription>{adsCopy.applySqlReminder}</AlertDescription>
        </Alert>
      ) : null}

      <Alert>
        <AlertTitle>{adsCopy.policyTitle}</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{adsCopy.policyBody}</p>
          <a
            href="https://support.google.com/adsense/answer/1346295"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
          >
            {adsCopy.policyLinkLabel}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </AlertDescription>
      </Alert>

      {enabledCount > 3 ? (
        <Alert className="border-amber-500/50 bg-amber-500/5">
          <AlertTitle className="text-amber-900 dark:text-amber-100">
            {adsCopy.manyPlacementsWarning}
          </AlertTitle>
        </Alert>
      ) : null}

      {message === 'saved' ? (
        <Alert className="border-emerald-600/30 bg-emerald-600/5">
          <AlertDescription>{adsCopy.saved}</AlertDescription>
        </Alert>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{adsCopy.masterEnable}</CardTitle>
          <CardDescription>{adsCopy.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <Label htmlFor="ads-master" className="cursor-pointer text-sm font-medium">
              {adsCopy.masterEnable}
            </Label>
            <Switch id="ads-master" checked={adsEnabled} onCheckedChange={setAdsEnabled} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-id">{adsCopy.publisherId}</Label>
            <Input
              id="pub-id"
              placeholder="ca-pub-xxxxxxxxxxxxxxxx"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              disabled={!adsEnabled}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">{adsCopy.publisherHint}</p>
          </div>
        </CardContent>
      </Card>

      {AD_PLACEMENT_KEYS.map((key) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="text-base">{adsCopy[PLACEMENT_TITLE_KEY[key]]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor={`placement-${key}`} className="cursor-pointer text-sm">
                {adsCopy.enablePlacement}
              </Label>
              <Switch
                id={`placement-${key}`}
                checked={placementForm[key].on}
                onCheckedChange={(on) => setPlacement(key, { on })}
                disabled={!adsEnabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`slot-${key}`}>{adsCopy.slotId}</Label>
              <Input
                id={`slot-${key}`}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="1234567890"
                value={placementForm[key].slot}
                onChange={(e) => setPlacement(key, { slot: e.target.value })}
                disabled={!adsEnabled || !placementForm[key].on}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">{adsCopy.slotHint}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" onClick={handleSave} disabled={loading} className="min-w-[120px]">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {admin.save}
      </Button>
    </div>
  );
}
