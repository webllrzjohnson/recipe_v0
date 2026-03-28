import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow login page access without auth
  // This check is handled in the children routes

  return (
    <div className="flex min-h-screen">
      {user && <AdminSidebar locale={locale} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
