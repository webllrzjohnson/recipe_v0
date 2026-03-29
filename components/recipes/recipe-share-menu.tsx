'use client';

import { useEffect, useState } from 'react';
import { copy } from '@/lib/copy';
import { ChevronDown, Link2, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

function buildSocialUrls(url: string, title: string) {
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}`,
    pinterest: `https://www.pinterest.com/pin/create/button/?url=${encUrl}&description=${encTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`,
  };
}

type RecipeShareMenuProps = {
  url: string;
  title: string;
  description?: string | null;
  className?: string;
};

export function RecipeShareMenu({
  url,
  title,
  description,
  className,
}: RecipeShareMenuProps) {
  const rc = copy.recipe;
  const [copied, cycleCopied] = useState(false);
  const [nativeShare, setNativeShare] = useState(false);

  useEffect(() => {
    setNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const social = buildSocialUrls(url, title);
  const shareText =
    description?.trim().slice(0, 280) || title;

  const triggerClass =
    'inline-flex items-center gap-1 bg-transparent p-0 font-sans text-sm text-foreground underline underline-offset-4 decoration-[#474747]/35 hover:decoration-primary dark:decoration-muted-foreground/50';

  return (
    <div className={cn('print:hidden', className)}>
      <DropdownMenu
        onOpenChange={(open) => {
          if (!open) cycleCopied(false);
        }}
      >
        <DropdownMenuTrigger
          type="button"
          className={triggerClass}
          aria-label={rc.shareRecipeAria}
        >
          <Share2 className="size-4 shrink-0 opacity-80" aria-hidden />
          {rc.shareRecipe}
          <ChevronDown className="size-3.5 shrink-0 opacity-70" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[12rem]">
          {nativeShare ? (
            <>
              <DropdownMenuItem
                onSelect={() => {
                  void navigator.share({
                    title,
                    text: shareText,
                    url,
                  }).catch(() => {});
                }}
              >
                {rc.shareNative}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : null}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              void navigator.clipboard.writeText(url).then(
                () => {
                  cycleCopied(true);
                  window.setTimeout(() => cycleCopied(false), 2000);
                },
                () => {}
              );
            }}
          >
            <Link2 className="size-4" aria-hidden />
            {copied ? rc.linkCopied : rc.copyLink}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            {rc.shareOnSocial}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rc.shareFacebook}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={social.x} target="_blank" rel="noopener noreferrer">
              {rc.shareX}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={social.pinterest}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rc.sharePinterest}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rc.shareLinkedIn}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rc.shareWhatsApp}
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
