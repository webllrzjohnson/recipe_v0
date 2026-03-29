'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, X } from 'lucide-react';
import { RecipeRichTextEditor } from '@/components/admin/recipe-rich-text-editor';
import { AdminImageUploadButton } from '@/components/admin/admin-image-upload-button';
import type { Category, Recipe } from '@/lib/types/database';

const admin = copy.admin;

function normalizeBlogHtml(html: string): string | null {
  const t = html.trim();
  if (!t) return null;
  if (/<(img\b|iframe\b|div[^>]*\bdata-youtube-video)/i.test(t)) return t;
  const textOnly = t.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return textOnly.length ? t : null;
}

function coalesceStringArrayField(value: unknown): string[] {
  if (!Array.isArray(value)) return [''];
  const strings = value.filter((item): item is string => typeof item === 'string');
  return strings.length > 0 ? strings : [''];
}

interface RecipeFormProps {
  categories: Category[];
  recipe?: Recipe;
}

export function RecipeForm({ categories, recipe }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [titleEn, setTitleEn] = useState(recipe?.title_en || '');
  const [slugEn, setSlugEn] = useState(recipe?.slug_en || '');
  const [descriptionEn, setDescriptionEn] = useState(recipe?.description_en || '');
  const [ingredientsEn, setIngredientsEn] = useState<string[]>(
    recipe?.ingredients_en || ['']
  );
  const [instructionsEn, setInstructionsEn] = useState<string[]>(
    recipe?.instructions_en || ['']
  );
  const [blogEn, setBlogEn] = useState(recipe?.blog_en || '');
  const [notesEn, setNotesEn] = useState(recipe?.notes_en || '');
  const [nutritionEn, setNutritionEn] = useState<string[]>(
    coalesceStringArrayField(recipe?.nutrition_en)
  );
  const [prepTime, setPrepTime] = useState(
    recipe?.prep_time_minutes?.toString() || ''
  );
  const [cookTime, setCookTime] = useState(
    recipe?.cook_time_minutes?.toString() || ''
  );
  const [servings, setServings] = useState(recipe?.servings?.toString() || '');
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || '');
  const [categoryId, setCategoryId] = useState(recipe?.category_id || '');
  const [imageUrl, setImageUrl] = useState(recipe?.image_url || '');
  const [isFeatured, setIsFeatured] = useState(recipe?.is_featured || false);
  const [isPublished, setIsPublished] = useState(recipe?.is_published || false);

  const slugify = (title: string) =>
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const generateSlugEn = () => {
    setSlugEn(slugify(titleEn));
  };

  const handleArrayChange = (
    index: number,
    value: string,
    array: string[],
    setArray: (arr: string[]) => void
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const addArrayItem = (array: string[], setArray: (arr: string[]) => void) => {
    setArray([...array, '']);
  };

  const removeArrayItem = (
    index: number,
    array: string[],
    setArray: (arr: string[]) => void
  ) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const recipeData = {
      title_en: titleEn,
      slug_en: slugEn.trim(),
      description_en: descriptionEn,
      ingredients_en: ingredientsEn.filter((i) => i.trim()),
      instructions_en: instructionsEn.filter((i) => i.trim()),
      blog_en: normalizeBlogHtml(blogEn),
      notes_en: notesEn.trim() || null,
      nutrition_en: nutritionEn.filter((i) => i.trim()),
      prep_time_minutes: prepTime ? parseInt(prepTime, 10) : null,
      cook_time_minutes: cookTime ? parseInt(cookTime, 10) : null,
      servings: servings ? parseInt(servings) : null,
      difficulty: difficulty || null,
      category_id: categoryId || null,
      image_url: imageUrl || null,
      is_featured: isFeatured,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (recipe) {
      const result = await supabase
        .from('recipes')
        .update(recipeData)
        .eq('id', recipe.id);
      error = result.error;
    } else {
      const result = await supabase.from('recipes').insert(recipeData);
      error = result.error;
    }

    if (!error) {
      router.push('/admin/recipes');
      router.refresh();
    } else {
      console.error('Error saving recipe:', error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Basic information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titleEn">Title</Label>
            <Input
              id="titleEn"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              onBlur={generateSlugEn}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slugEn">Slug</Label>
            <Input
              id="slugEn"
              value={slugEn}
              onChange={(e) => setSlugEn(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descriptionEn">Description</Label>
            <Textarea
              id="descriptionEn"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={3}
            />
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
                folder="recipes"
                disabled={loading}
                onUploaded={setImageUrl}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story / blog (above recipe card on public page) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Story (above recipe card)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rich text with images (paste URL) and YouTube embeds. Shown under the title on the recipe page.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <RecipeRichTextEditor
              key={`blog-en-${recipe?.id ?? 'new'}`}
              id="blogEn"
              value={blogEn}
              onChange={setBlogEn}
              placeholder="Intro, tips, story… Use the toolbar for image URL or YouTube link."
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipe Details */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Recipe details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time (min)</Label>
              <Input
                id="prepTime"
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookTime">Cook Time (min)</Label>
              <Input
                id="cookTime"
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {ingredientsEn.map((ing, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ing}
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      e.target.value,
                      ingredientsEn,
                      setIngredientsEn
                    )
                  }
                  placeholder={`Ingredient ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeArrayItem(index, ingredientsEn, setIngredientsEn)
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(ingredientsEn, setIngredientsEn)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {instructionsEn.map((inst, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={inst}
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      e.target.value,
                      instructionsEn,
                      setInstructionsEn
                    )
                  }
                  placeholder={`Step ${index + 1}`}
                  rows={2}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeArrayItem(index, instructionsEn, setInstructionsEn)
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(instructionsEn, setInstructionsEn)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes & nutrition */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Notes & nutrition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notesEn">Notes</Label>
            <Textarea
              id="notesEn"
              value={notesEn}
              onChange={(e) => setNotesEn(e.target.value)}
              rows={4}
              placeholder="Substitutions, make-ahead tips, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Nutrition facts</Label>
            <p className="text-xs text-muted-foreground">
              One line per fact, e.g. Calories: 798 kcal (40%)
            </p>
            {nutritionEn.map((line, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={line}
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      e.target.value,
                      nutritionEn,
                      setNutritionEn
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeArrayItem(index, nutritionEn, setNutritionEn)
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(nutritionEn, setNutritionEn)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add line
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Publishing options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="featured">{admin.featured}</Label>
              <p className="text-sm text-muted-foreground">Display on homepage</p>
            </div>
            <Switch
              id="featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="published">{admin.published}</Label>
              <p className="text-sm text-muted-foreground">Make visible to public</p>
            </div>
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/recipes')}
        >
          {admin.cancel}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            admin.save
          )}
        </Button>
      </div>
    </form>
  );
}
