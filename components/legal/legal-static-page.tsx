import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LegalDocument } from '@/components/legal/legal-document';
import { getLegalPage, type LegalPageSlug } from '@/lib/legal';
import type { Locale } from '@/i18n/config';

export async function LegalStaticPage({
  locale,
  slug,
}: {
  locale: string;
  slug: LegalPageSlug;
}) {
  setRequestLocale(locale);
  const content = getLegalPage(slug, locale as Locale);
  const t = await getTranslations({ locale, namespace: 'legal' });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">{content.description}</p>
          <div className="mt-10">
            <LegalDocument
              content={content}
              lastUpdatedLabel={t('lastUpdated')}
              lastUpdated={t('lastUpdatedDate')}
            />
          </div>
          <p className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground italic">
            {t('attorneyReview')}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
