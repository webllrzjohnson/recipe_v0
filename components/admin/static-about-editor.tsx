'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { SITE_LOCALE } from '@/lib/site-locale';
import { createClient } from '@/lib/supabase/client';
import type { AboutPageStoredContent } from '@/lib/static-pages/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface StaticAboutEditorProps {
  initialContent: AboutPageStoredContent;
}

const pagesCopy = copy.admin.pages;
const admin = copy.admin;

export function StaticAboutEditor({ initialContent }: StaticAboutEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<'saved' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialContent.title);
  const [subtitle, setSubtitle] = useState(initialContent.subtitle);
  const [storyHeading, setStoryHeading] = useState(initialContent.storyHeading);
  const [storyText, setStoryText] = useState(initialContent.storyText);
  const [missionHeading, setMissionHeading] = useState(initialContent.missionHeading);
  const [missionText, setMissionText] = useState(initialContent.missionText);
  const [valuesHeading, setValuesHeading] = useState(initialContent.valuesHeading);
  const [storyImageUrl, setStoryImageUrl] = useState(initialContent.storyImageUrl);
  const [missionImageUrl, setMissionImageUrl] = useState(initialContent.missionImageUrl);
  const [values, setValues] = useState(() =>
    initialContent.values.map((v) => ({ title: v.title, description: v.description }))
  );

  const updateValue = (i: number, field: 'title' | 'description', v: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: v };
      return next;
    });
  };

  const addValue = () => {
    setValues((prev) => [...prev, { title: '', description: '' }]);
  };

  const removeValue = (i: number) => {
    setValues((prev) => (prev.length <= 1 ? prev : prev.filter((_, j) => j !== i)));
  };

  const handleSave = async () => {
    setMessage(null);
    setError(null);
    const content: AboutPageStoredContent = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      storyHeading: storyHeading.trim(),
      storyText: storyText.trim(),
      missionHeading: missionHeading.trim(),
      missionText: missionText.trim(),
      valuesHeading: valuesHeading.trim(),
      storyImageUrl: storyImageUrl.trim(),
      missionImageUrl: missionImageUrl.trim(),
      values: values.map((v) => ({
        title: v.title.trim(),
        description: v.description.trim(),
      })),
    };
    if (
      !content.title ||
      !content.subtitle ||
      !content.storyHeading ||
      !content.storyText ||
      !content.missionHeading ||
      !content.missionText ||
      !content.valuesHeading ||
      content.values.length === 0
    ) {
      setError(pagesCopy.validationRequired);
      return;
    }
    for (const v of content.values) {
      if (!v.title || !v.description) {
        setError(pagesCopy.validationValue);
        return;
      }
    }

    setLoading(true);
    const supabase = createClient();
    const { error: saveErr } = await supabase.from('static_pages').upsert(
      {
        page_slug: 'about',
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
          <CardTitle className="text-base">{pagesCopy.aboutHero}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ab-title">{pagesCopy.pageTitle}</Label>
            <Input id="ab-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ab-sub">{pagesCopy.subtitle}</Label>
            <Textarea id="ab-sub" rows={2} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{pagesCopy.aboutStory}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ab-story-url">{pagesCopy.imageUrl}</Label>
            <Input
              id="ab-story-url"
              value={storyImageUrl}
              onChange={(e) => setStoryImageUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ab-story-h">{pagesCopy.sectionHeading}</Label>
            <Input
              id="ab-story-h"
              value={storyHeading}
              onChange={(e) => setStoryHeading(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ab-story-t">{pagesCopy.bodyText}</Label>
            <Textarea
              id="ab-story-t"
              rows={5}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{pagesCopy.aboutMission}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ab-mis-url">{pagesCopy.imageUrl}</Label>
            <Input
              id="ab-mis-url"
              value={missionImageUrl}
              onChange={(e) => setMissionImageUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ab-mis-h">{pagesCopy.sectionHeading}</Label>
            <Input
              id="ab-mis-h"
              value={missionHeading}
              onChange={(e) => setMissionHeading(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ab-mis-t">{pagesCopy.bodyText}</Label>
            <Textarea
              id="ab-mis-t"
              rows={5}
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{pagesCopy.valuesBlock}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ab-val-h">{pagesCopy.valuesHeading}</Label>
            <Input
              id="ab-val-h"
              value={valuesHeading}
              onChange={(e) => setValuesHeading(e.target.value)}
            />
          </div>
          {values.map((v, i) => (
            <div key={i} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  {pagesCopy.valueCard.replace('{num}', String(i + 1))}
                </span>
                {values.length > 1 ? (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeValue(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              <Input
                placeholder={pagesCopy.valueTitlePh}
                value={v.title}
                onChange={(e) => updateValue(i, 'title', e.target.value)}
              />
              <Textarea
                placeholder={pagesCopy.valueDescPh}
                rows={3}
                value={v.description}
                onChange={(e) => updateValue(i, 'description', e.target.value)}
              />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addValue}>
            <Plus className="mr-1 h-4 w-4" />
            {pagesCopy.addValue}
          </Button>
        </CardContent>
      </Card>

      <Button type="button" onClick={handleSave} disabled={loading} className="min-w-[120px]">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {admin.save}
      </Button>
    </div>
  );
}
