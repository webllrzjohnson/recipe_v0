import { redirect } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/server';
import { AdsSettingsForm } from '@/components/admin/ads-settings-form';
import type { SiteSettings } from '@/lib/types/database';

const ads = copy.admin.ads;

export default async function AdminAdsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/admin/login');
  }

  const { data: row, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">{ads.title}</h1>
        <p className="text-muted-foreground">{ads.description}</p>
      </div>

      <AdsSettingsForm
        initialRow={(error ? null : row) as SiteSettings | null}
        loadError={Boolean(error)}
      />
    </div>
  );
}
