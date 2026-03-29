'use client';

import { useEffect, useRef } from 'react';
import { copy } from '@/lib/copy';
import { useAdsenseConsent } from '@/components/ads/use-adsense-consent';
import type { AdPlacementKey } from '@/lib/ads/placements';
import type { PublicAdSettings } from '@/lib/supabase/fetch-site-settings';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

interface AdSensePlacementProps {
  settings: PublicAdSettings;
  placementKey: AdPlacementKey;
  className?: string;
}

/**
 * Responsive display unit with an "Advertisement" label (AdSense policy: ads distinguishable from content).
 * Hidden for print. Renders nothing without consent, config, or slot.
 */
export function AdSensePlacement({
  settings,
  placementKey,
  className,
}: AdSensePlacementProps) {
  const consentOk = useAdsenseConsent();
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const slotConfig = settings.placements[placementKey];
  const shouldShow =
    consentOk &&
    settings.adsActive &&
    slotConfig.enabled &&
    slotConfig.slot_id.length > 0 &&
    !!settings.publisherId;

  useEffect(() => {
    if (!shouldShow || !insRef.current || pushedRef.current) return;
    pushedRef.current = true;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      pushedRef.current = false;
    }
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <aside
      className={cn(
        'print:hidden',
        'my-6 flex w-full flex-col items-center gap-1',
        className
      )}
      aria-label={copy.common.adsLabel}
    >
      <p className="w-full max-w-3xl text-center text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
        {copy.common.adsLabel}
      </p>
      <div className="flex min-h-[100px] w-full max-w-3xl justify-center">
        <ins
          ref={insRef}
          className="adsbygoogle block w-full max-w-full"
          style={{ display: 'block' }}
          data-ad-client={settings.publisherId!}
          data-ad-slot={slotConfig.slot_id}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
