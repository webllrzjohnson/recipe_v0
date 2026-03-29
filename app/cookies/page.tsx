import { buildLegalMetadata } from '@/lib/legal/metadata';
import { LegalStaticPage } from '@/components/legal/legal-static-page';

export async function generateMetadata() {
  return buildLegalMetadata('cookies');
}

export default async function CookiesPage() {
  return <LegalStaticPage slug="cookies" />;
}
