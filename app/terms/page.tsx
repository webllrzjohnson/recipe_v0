import { buildLegalMetadata } from '@/lib/legal/metadata';
import { LegalStaticPage } from '@/components/legal/legal-static-page';

export async function generateMetadata() {
  return buildLegalMetadata('terms');
}

export default async function TermsPage() {
  return <LegalStaticPage slug="terms" />;
}
