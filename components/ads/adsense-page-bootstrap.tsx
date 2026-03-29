'use client';

import Script from 'next/script';
import { useAdsenseConsent } from '@/components/ads/use-adsense-consent';

interface AdSensePageBootstrapProps {
  /** When false, no script (admin disabled ads or missing config). */
  configAllowsAds: boolean;
  publisherId: string | null;
}

/**
 * Loads the official AdSense loader once per page when consent and config allow.
 * Must render before or alongside display units on the same page.
 */
export function AdSensePageBootstrap({
  configAllowsAds,
  publisherId,
}: AdSensePageBootstrapProps) {
  const consentOk = useAdsenseConsent();

  if (!configAllowsAds || !publisherId || !consentOk) {
    return null;
  }

  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    publisherId
  )}`;

  return (
    <Script
      id="adsbygoogle-js"
      strategy="afterInteractive"
      src={src}
      crossOrigin="anonymous"
    />
  );
}
