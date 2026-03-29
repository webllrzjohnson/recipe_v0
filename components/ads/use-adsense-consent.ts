'use client';

import { useEffect, useState } from 'react';
import {
  COOKIE_CONSENT_STORAGE_KEY,
  type CookieConsentValue,
  COOKIE_CONSENT_EVENT,
} from '@/lib/compliance/cookie-consent';

function readConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (raw === 'all' || raw === 'essential') return raw;
    return null;
  } catch {
    return null;
  }
}

/**
 * AdSense uses cookies; we only initialize units after explicit "Accept all",
 * aligned with EU/UK expectations and our cookie banner (analytics uses the same gate).
 */
export function useAdsenseConsent(): boolean {
  const [allowPersonalizedAds, setAllow] = useState(false);

  useEffect(() => {
    const sync = () => setAllow(readConsent() === 'all');
    sync();
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  return allowPersonalizedAds;
}
