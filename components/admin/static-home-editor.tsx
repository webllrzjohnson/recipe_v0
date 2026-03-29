'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { SITE_LOCALE } from '@/lib/site-locale';
import { createClient } from '@/lib/supabase/client';
import type { HomePageStoredContent } from '@/lib/static-pages/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { AdminImageUploadButton } from '@/components/admin/admin-image-upload-button';

interface StaticHomeEditorProps {
  initialContent: HomePageStoredContent;
}

const pagesCopy = copy.admin.pages;
const admin = copy.admin;

export function StaticHomeEditor({ initialContent }: StaticHomeEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<'saved' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [tagline, setTagline] = useState(initialContent.tagline);
  const [heroTitle, setHeroTitle] = useState(initialContent.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(initialContent.heroSubtitle);
  const [exploreRecipesLabel, setExploreRecipesLabel] = useState(
    initialContent.exploreRecipesLabel
  );
  const [blogLabel, setBlogLabel] = useState(initialContent.blogLabel);
  const [heroImageUrl, setHeroImageUrl] = useState(initialContent.heroImageUrl);
  const [heroImageAlt, setHeroImageAlt] = useState(initialContent.heroImageAlt);

  const handleSave = async () => {
    setMessage(null);
    setError(null);
    const content: HomePageStoredContent = {
      tagline: tagline.trim(),
      heroTitle: heroTitle.trim(),
      heroSubtitle: heroSubtitle.trim(),
      exploreRecipesLabel: exploreRecipesLabel.trim(),
      blogLabel: blogLabel.trim(),
      heroImageUrl: heroImageUrl.trim(),
      heroImageAlt: heroImageAlt.trim(),
    };
    if (
      !content.tagline ||
      !content.heroTitle ||
      !content.heroSubtitle ||
      !content.exploreRecipesLabel ||
      !content.blogLabel ||
      !content.heroImageUrl ||
      !content.heroImageAlt
    ) {
      setError(pagesCopy.validationRequired);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: saveErr } = await supabase.from('static_pages').upsert(
      {
        page_slug: 'home',
        locale: SITE_LOCALE,
        content: content as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'page_slug,locale' }
    );
    setLoading(false);
    if (saveErr) {
      setError(pagesCopy.saveError);
      return;
    }
    setMessage('saved');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {message === 'saved' ? (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {pagesCopy.saved}
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>{pagesCopy.homeHero}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="home-tagline">{pagesCopy.heroTagline}</Label>
            <Input
              id="home-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home-title">{pagesCopy.heroTitleLabel}</Label>
            <Input
              id="home-title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home-subtitle">{pagesCopy.heroSubtitleLabel}</Label>
            <Textarea
              id="home-subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={4}
              maxLength={2000}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home-explore">{pagesCopy.exploreButtonLabel}</Label>
            <Input
              id="home-explore"
              value={exploreRecipesLabel}
              onChange={(e) => setExploreRecipesLabel(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home-blog">{pagesCopy.blogButtonLabel}</Label>
            <Input
              id="home-blog"
              value={blogLabel}
              onChange={(e) => setBlogLabel(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home-image-url">{pagesCopy.imageUrl}</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="home-image-url"
                className="sm:min-w-0 sm:flex-1"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://…"
              />
              <AdminImageUploadButton
                folder="static-home"
                disabled={loading}
                onUploaded={setHeroImageUrl}
              />
            </div>
            <p className="text-xs text-muted-foreground">{pagesCopy.homeImageUrlHint}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="home-image-alt">{pagesCopy.heroImageAltLabel}</Label>
            <Input
              id="home-image-alt"
              value={heroImageAlt}
              onChange={(e) => setHeroImageAlt(e.target.value)}
              maxLength={200}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="button" onClick={handleSave} disabled={loading} className="min-w-[120px]">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {admin.save}
      </Button>
    </div>
  );
}
