import { buildLegalMetadata } from '@/lib/legal/metadata';
import { LegalStaticPage } from '@/components/legal/legal-static-page';

export async function generateMetadata() {
  return buildLegalMetadata('privacy');
}

export default async function PrivacyPage() {
  return <LegalStaticPage slug="privacy" />;
}
