'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  COOKIE_CONSENT_STORAGE_KEY,
  type CookieConsentValue,
  COOKIE_CONSENT_EVENT,
} from '@/lib/compliance/cookie-consent';

function readStored(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (raw === 'all' || raw === 'essential') return raw;
    return null;
  } catch {
    return null;
  }
}

function persist(value: CookieConsentValue) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  } catch {
    /* private mode, etc. */
  }
}

export function CookieConsentBanner() {
  const t = useTranslations('legal.cookieBanner');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readStored() === null);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-md supports-backdrop-filter:bg-background/85 md:p-5"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="min-w-0 space-y-1 text-sm">
          <p id="cookie-banner-title" className="font-medium text-foreground">
            {t('title')}
          </p>
          <p id="cookie-banner-desc" className="text-muted-foreground leading-relaxed">
            {t('body')}{' '}
            <Link href="/privacy" className="text-primary underline underline-offset-4 hover:no-underline">
              {t('privacyLink')}
            </Link>
            {' · '}
            <Link href="/cookies" className="text-primary underline underline-offset-4 hover:no-underline">
              {t('cookiePolicyLink')}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              persist('essential');
              setVisible(false);
            }}
          >
            {t('essentialOnly')}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              persist('all');
              setVisible(false);
            }}
          >
            {t('acceptAll')}
          </Button>
        </div>
      </div>
    </div>
  );
}
