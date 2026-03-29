import { buildLegalMetadata } from '@/lib/legal/metadata';
import { LegalStaticPage } from '@/components/legal/legal-static-page';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildLegalMetadata(locale, 'terms');
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalStaticPage locale={locale} slug="terms" />;
}
