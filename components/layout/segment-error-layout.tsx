'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export function SegmentErrorLayout({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">{t('error')}</p>
          <Button type="button" onClick={() => reset()}>
            {t('retry')}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
