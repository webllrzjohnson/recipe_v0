'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Loader2 } from 'lucide-react';
import type { Category } from '@/lib/types/database';
import { AdminImageUploadButton } from '@/components/admin/admin-image-upload-button';

interface CategoryFormDialogProps {
  category?: Category;
  isEdit?: boolean;
}

const admin = copy.admin;

export function CategoryFormDialog({
  category,
  isEdit,
}: CategoryFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameEn, setNameEn] = useState(category?.name_en || '');
  const [nameFr, setNameFr] = useState(category?.name_fr || '');
  const [slugEn, setSlugEn] = useState(category?.slug_en || '');
  const [slugFr, setSlugFr] = useState(category?.slug_fr || '');
  const [descriptionEn, setDescriptionEn] = useState(
    category?.description_en || ''
  );
  const [descriptionFr, setDescriptionFr] = useState(
    category?.description_fr || ''
  );
  const [imageUrl, setImageUrl] = useState(category?.image_url || '');

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const generateSlugEn = () => {
    setSlugEn(slugify(nameEn));
  };

  const generateSlugFr = () => {
    setSlugFr(slugify(nameFr));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const categoryData = {
      name_en: nameEn,
      name_fr: nameFr,
      slug_en: slugEn,
      slug_fr: slugFr.trim() || null,
      description_en: descriptionEn || null,
      description_fr: descriptionFr || null,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (isEdit && category) {
      const result = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', category.id);
      error = result.error;
    } else {
      const result = await supabase.from('categories').insert(categoryData);
      error = result.error;
    }

    if (!error) {
      setOpen(false);
      router.refresh();
    } else {
      console.error('Error saving category:', error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {admin.addNew}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {isEdit ? admin.editCategoryTitle : admin.newCategoryTitle}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nameEn">Name (English)</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                onBlur={generateSlugEn}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameFr">Nom (Français)</Label>
              <Input
                id="nameFr"
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                onBlur={generateSlugFr}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slugEn">Slug (English URL)</Label>
            <Input
              id="slugEn"
              value={slugEn}
              onChange={(e) => setSlugEn(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slugFr">Slug (French URL)</Label>
            <Input
              id="slugFr"
              value={slugFr}
              onChange={(e) => setSlugFr(e.target.value)}
              onBlur={generateSlugFr}
              placeholder="optional"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="descriptionEn">Description (English)</Label>
              <Textarea
                id="descriptionEn"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionFr">Description (Français)</Label>
              <Textarea
                id="descriptionFr"
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="imageUrl"
                className="sm:min-w-0 sm:flex-1"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <AdminImageUploadButton
                folder="categories"
                disabled={loading}
                onUploaded={setImageUrl}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {admin.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                admin.save
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
