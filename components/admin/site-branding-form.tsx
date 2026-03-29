'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/client';
import { COLOR_SCHEME_KEYS, FONT_PAIR_KEYS } from '@/lib/site/theme-presets';
import { AdminImageUploadButton } from '@/components/admin/admin-image-upload-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const branding = copy.admin.siteBranding;
type ColorCopy = Record<string, string>;
type FontCopy = Record<string, string>;
const colorLabels = branding.colors as unknown as ColorCopy;
const fontLabels = branding.fonts as unknown as FontCopy;

export interface SiteBrandingFormValues {
  siteName: string;
  siteTagline: string;
  colorScheme: string;
  fontPair: string;
  faviconUrl: string | null;
}

interface SiteBrandingFormProps {
  initial: SiteBrandingFormValues;
  loadError?: boolean;
}

export function SiteBrandingForm({ initial, loadError }: SiteBrandingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initial.siteName);
  const [tagline, setTagline] = useState(initial.siteTagline);
  const [colorScheme, setColorScheme] = useState(initial.colorScheme);
  const [fontPair, setFontPair] = useState(initial.fontPair);
  const [faviconUrl, setFaviconUrl] = useState(initial.faviconUrl ?? '');
  const [message, setMessage] = useState<'saved' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMessage(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage(branding.required);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const faviconTrimmed = faviconUrl.trim();
    const { data, error } = await supabase
      .from('site_settings')
      .update({
        site_name: trimmedName,
        site_tagline: tagline.trim(),
        color_scheme: colorScheme,
        font_pair: fontPair,
        favicon_url: faviconTrimmed || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select('id')
      .maybeSingle();

    setLoading(false);

    if (error || !data) {
      setErrorMessage(branding.saveError);
      return;
    }
    setMessage('saved');
    router.refresh();
  };

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle className="font-serif">{branding.title}</CardTitle>
        <CardDescription>{branding.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loadError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{branding.loadErrorTitle}</AlertTitle>
            <AlertDescription>{branding.loadErrorBody}</AlertDescription>
          </Alert>
        ) : null}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">{branding.label}</Label>
            <Input
              id="siteName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={copy.common.siteName}
              autoComplete="organization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">{branding.taglineLabel}</Label>
            <p className="text-xs text-muted-foreground">{branding.taglineHint}</p>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder={copy.common.tagline}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{branding.colorLabel}</Label>
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_SCHEME_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {colorLabels[key] ?? key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{branding.fontLabel}</Label>
              <Select value={fontPair} onValueChange={setFontPair}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_PAIR_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {fontLabels[key] ?? key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faviconUrl">{branding.faviconLabel}</Label>
            <p className="text-xs text-muted-foreground">{branding.faviconHint}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="faviconUrl"
                className="sm:min-w-0 sm:flex-1"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="https://…"
              />
              <AdminImageUploadButton
                folder="site"
                disabled={loading}
                onUploaded={(url) => setFaviconUrl(url)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFaviconUrl('')}
            >
              {branding.clearFavicon}
            </Button>
          </div>

          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}
          {message === 'saved' ? (
            <p className="text-sm text-green-600 dark:text-green-500">{branding.saved}</p>
          ) : null}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {branding.saving}
              </>
            ) : (
              copy.admin.save
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
