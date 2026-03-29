import type { SupabaseClient } from '@supabase/supabase-js';
import { CMS_UPLOADS_BUCKET } from '@/lib/supabase/cms-uploads-bucket';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export type UploadCmsImageErrorCode = 'invalid-type' | 'too-large' | 'upload-failed';

export async function uploadCmsImage(
  supabase: SupabaseClient,
  file: File,
  folder: string
): Promise<
  { ok: true; publicUrl: string } | { ok: false; code: UploadCmsImageErrorCode; message?: string }
> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, code: 'invalid-type' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, code: 'too-large' };
  }
  const rawExt = (file.name.split('.').pop() || '').toLowerCase();
  let ext = rawExt.replace(/[^a-z0-9]/g, '');
  if (!ext) {
    if (file.type === 'image/png') ext = 'png';
    else if (file.type === 'image/webp') ext = 'webp';
    else if (file.type === 'image/gif') ext = 'gif';
    else ext = 'jpg';
  }
  const safeFolder =
    folder.replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '') || 'misc';
  const path = `${safeFolder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const { data, error } = await supabase.storage
    .from(CMS_UPLOADS_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });
  if (error || !data?.path) {
    return {
      ok: false,
      code: 'upload-failed',
      message: error?.message,
    };
  }
  const { data: pub } = supabase.storage.from(CMS_UPLOADS_BUCKET).getPublicUrl(data.path);
  return { ok: true, publicUrl: pub.publicUrl };
}
