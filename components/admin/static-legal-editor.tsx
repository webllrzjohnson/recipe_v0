'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { SITE_LOCALE } from '@/lib/site-locale';
import { createClient } from '@/lib/supabase/client';
import type { LegalPageContent, LegalPageSlug } from '@/lib/legal/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface StaticLegalEditorProps {
  pageSlug: LegalPageSlug;
  initialContent: LegalPageContent;
}

const pagesCopy = copy.admin.pages;
const admin = copy.admin;

export function StaticLegalEditor({
  pageSlug,
  initialContent,
}: StaticLegalEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<'saved' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialContent.title);
  const [description, setDescription] = useState(initialContent.description);
  const [sections, setSections] = useState(() =>
    initialContent.sections.map((s) => ({
      title: s.title,
      paragraphs: [...s.paragraphs],
    }))
  );

  const updateSectionTitle = (i: number, value: string) => {
    setSections((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], title: value };
      return next;
    });
  };

  const updateParagraph = (si: number, pi: number, value: string) => {
    setSections((prev) => {
      const next = [...prev];
      const paras = [...next[si].paragraphs];
      paras[pi] = value;
      next[si] = { ...next[si], paragraphs: paras };
      return next;
    });
  };

  const addParagraph = (si: number) => {
    setSections((prev) => {
      const next = [...prev];
      next[si] = {
        ...next[si],
        paragraphs: [...next[si].paragraphs, ''],
      };
      return next;
    });
  };

  const removeParagraph = (si: number, pi: number) => {
    setSections((prev) => {
      const next = [...prev];
      const paras = next[si].paragraphs.filter((_, j) => j !== pi);
      next[si] = { ...next[si], paragraphs: paras.length ? paras : [''] };
      return next;
    });
  };

  const addSection = () => {
    setSections((prev) => [...prev, { title: '', paragraphs: [''] }]);
  };

  const removeSection = (si: number) => {
    setSections((prev) => (prev.length <= 1 ? prev : prev.filter((_, j) => j !== si)));
  };

  const handleSave = async () => {
    setMessage(null);
    setError(null);
    const content: LegalPageContent = {
      title: title.trim(),
      description: description.trim(),
      sections: sections.map((s) => ({
        title: s.title.trim(),
        paragraphs: s.paragraphs.map((p) => p.trim()).filter((p) => p.length > 0),
      })),
    };
    if (!content.title || !content.description || content.sections.length === 0) {
      setError(pagesCopy.validationRequired);
      return;
    }
    for (const s of content.sections) {
      if (!s.title || s.paragraphs.length === 0) {
        setError(pagesCopy.validationSection);
        return;
      }
    }

    setLoading(true);
    const supabase = createClient();
    const { error: saveErr } = await supabase.from('static_pages').upsert(
      {
        page_slug: pageSlug,
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
          <CardTitle className="text-base">{pagesCopy.legalIntro}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="legal-title">{pagesCopy.pageTitle}</Label>
            <Input id="legal-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legal-desc">{pagesCopy.pageDescription}</Label>
            <Textarea
              id="legal-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {sections.map((section, si) => (
        <Card key={si}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">
              {pagesCopy.sectionLabel.replace('{num}', String(si + 1))}
            </CardTitle>
            {sections.length > 1 ? (
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(si)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`sec-title-${si}`}>{pagesCopy.sectionHeading}</Label>
              <Input
                id={`sec-title-${si}`}
                value={section.title}
                onChange={(e) => updateSectionTitle(si, e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>{pagesCopy.paragraphsLabel}</Label>
              {section.paragraphs.map((para, pi) => (
                <div key={pi} className="flex gap-2">
                  <Textarea
                    rows={4}
                    value={para}
                    onChange={(e) => updateParagraph(si, pi, e.target.value)}
                    className="min-h-[100px] flex-1"
                  />
                  {section.paragraphs.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeParagraph(si, pi)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addParagraph(si)}>
                <Plus className="mr-1 h-4 w-4" />
                {pagesCopy.addParagraph}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addSection}>
        <Plus className="mr-2 h-4 w-4" />
        {pagesCopy.addSection}
      </Button>

      <Button type="button" onClick={handleSave} disabled={loading} className="min-w-[120px]">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {admin.save}
      </Button>
    </div>
  );
}
