import { getSiteDisplayName } from '@/lib/site/get-site-display-name';
import { AdminLoginForm } from './admin-login-form';

export default async function AdminLoginPage() {
  const siteName = await getSiteDisplayName();
  return <AdminLoginForm siteName={siteName} />;
}
