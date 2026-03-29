'use client';

import { useRef, useState } from 'react';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/client';
import { uploadCmsImage } from '@/lib/supabase/upload-cms-image';
import { Button } from '@/components/ui/button';
import type { ComponentProps } from 'react';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const uploadCopy = copy.admin.imageUpload;

export interface AdminImageUploadButtonProps {
  folder: string;
  onUploaded: (publicUrl: string) => void;
  disabled?: boolean;
  className?: string;
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
  /** When false, only the upload icon is shown (e.g. rich-text toolbar). */
  showLabel?: boolean;
}

export function AdminImageUploadButton({
  folder,
  onUploaded,
  disabled,
  className,
  variant = 'secondary',
  size = 'sm',
  showLabel = true,
}: AdminImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pickFile = () => inputRef.current?.click();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setBusy(true);
    const supabase = createClient();
    const result = await uploadCmsImage(supabase, file, folder);
    setBusy(false);

    if (result.ok) {
      onUploaded(result.publicUrl);
      toast({ title: uploadCopy.success });
      return;
    }

    if (result.code === 'invalid-type') {
      toast({ title: uploadCopy.invalidType, variant: 'destructive' });
      return;
    }
    if (result.code === 'too-large') {
      toast({ title: uploadCopy.tooLarge, variant: 'destructive' });
      return;
    }
    toast({
      title: uploadCopy.failed,
      description: result.message,
      variant: 'destructive',
    });
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={onChange}
        aria-hidden
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn('shrink-0 gap-1.5', className)}
        disabled={disabled || busy}
        onClick={pickFile}
        aria-label={showLabel ? undefined : uploadCopy.label}
        title={showLabel ? undefined : uploadCopy.label}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Upload className="h-4 w-4" aria-hidden />
        )}
        {showLabel ? (busy ? uploadCopy.uploading : uploadCopy.label) : null}
      </Button>
    </>
  );
}
