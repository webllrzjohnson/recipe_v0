import { buildLegalMetadata } from '@/lib/legal/metadata';
import { LegalStaticPage } from '@/components/legal/legal-static-page';

export async function generateMetadata() {
  return buildLegalMetadata('disclaimer');
}

export default async function DisclaimerPage() {
  return <LegalStaticPage slug="disclaimer" />;
}
