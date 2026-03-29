'use client';

import { Analytics } from '@vercel/analytics/next';
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

export function ConsentAwareAnalytics() {
  const [allowAnalytics, setAllowAnalytics] = useState(false);

  useEffect(() => {
    const sync = () => setAllowAnalytics(readConsent() === 'all');
    sync();
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  if (!allowAnalytics) return null;
  return <Analytics />;
}
