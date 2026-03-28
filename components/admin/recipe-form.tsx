'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import type { Category, Recipe } from '@/lib/types/database';

interface RecipeFormProps {
  locale: string;
  categories: Category[];
  recipe?: Recipe;
}

export function RecipeForm({ locale, categories, recipe }: RecipeFormProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [titleEn, setTitleEn] = useState(recipe?.title_en || '');
  const [titleFr, setTitleFr] = useState(recipe?.title_fr || '');
  const [slug, setSlug] = useState(recipe?.slug || '');
  const [descriptionEn, setDescriptionEn] = useState(recipe?.description_en || '');
  const [descriptionFr, setDescriptionFr] = useState(recipe?.description_fr || '');
  const [ingredientsEn, setIngredientsEn] = useState<string[]>(
    recipe?.ingredients_en || ['']
  );
  const [ingredientsFr, setIngredientsFr] = useState<string[]>(
    recipe?.ingredients_fr || ['']
  );
  const [instructionsEn, setInstructionsEn] = useState<string[]>(
    recipe?.instructions_en || ['']
  );
  const [instructionsFr, setInstructionsFr] = useState<string[]>(
    recipe?.instructions_fr || ['']
  );
  const [prepTime, setPrepTime] = useState(recipe?.prep_time?.toString() || '');
  const [cookTime, setCookTime] = useState(recipe?.cook_time?.toString() || '');
  const [servings, setServings] = useState(recipe?.servings?.toString() || '');
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || '');
  const [categoryId, setCategoryId] = useState(recipe?.category_id || '');
  const [imageUrl, setImageUrl] = useState(recipe?.image_url || '');
  const [isFeatured, setIsFeatured] = useState(recipe?.is_featured || false);
  const [isPublished, setIsPublished] = useState(recipe?.is_published || false);

  const generateSlug = () => {
    const generatedSlug = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
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
      title_fr: titleFr,
      slug,
      description_en: descriptionEn,
      description_fr: descriptionFr,
      ingredients_en: ingredientsEn.filter((i) => i.trim()),
      ingredients_fr: ingredientsFr.filter((i) => i.trim()),
      instructions_en: instructionsEn.filter((i) => i.trim()),
      instructions_fr: instructionsFr.filter((i) => i.trim()),
      prep_time: prepTime ? parseInt(prepTime) : null,
      cook_time: cookTime ? parseInt(cookTime) : null,
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
      router.push(`/${locale}/admin/recipes`);
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
          <CardTitle className="font-serif">
            {locale === 'fr' ? 'Informations de Base' : 'Basic Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titleEn">Title (English)</Label>
              <Input
                id="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                onBlur={generateSlug}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleFr">Titre (Français)</Label>
              <Input
                id="titleFr"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="descriptionEn">Description (English)</Label>
              <Textarea
                id="descriptionEn"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionFr">Description (Français)</Label>
              <Textarea
                id="descriptionFr"
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipe Details */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {locale === 'fr' ? 'Détails de la Recette' : 'Recipe Details'}
          </CardTitle>
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
                    {locale === 'fr' ? cat.name_fr : cat.name_en}
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
          <CardTitle className="font-serif">
            {locale === 'fr' ? 'Ingrédients' : 'Ingredients'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>English</Label>
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
            <div className="space-y-2">
              <Label>Français</Label>
              {ingredientsFr.map((ing, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ing}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        e.target.value,
                        ingredientsFr,
                        setIngredientsFr
                      )
                    }
                    placeholder={`Ingrédient ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeArrayItem(index, ingredientsFr, setIngredientsFr)
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
                onClick={() => addArrayItem(ingredientsFr, setIngredientsFr)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>English</Label>
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
            <div className="space-y-2">
              <Label>Français</Label>
              {instructionsFr.map((inst, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={inst}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        e.target.value,
                        instructionsFr,
                        setInstructionsFr
                      )
                    }
                    placeholder={`Étape ${index + 1}`}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeArrayItem(index, instructionsFr, setInstructionsFr)
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
                onClick={() => addArrayItem(instructionsFr, setInstructionsFr)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {locale === 'fr' ? 'Options de Publication' : 'Publishing Options'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="featured">{t('featured')}</Label>
              <p className="text-sm text-muted-foreground">
                {locale === 'fr'
                  ? 'Afficher sur la page d\'accueil'
                  : 'Display on homepage'}
              </p>
            </div>
            <Switch
              id="featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="published">{t('published')}</Label>
              <p className="text-sm text-muted-foreground">
                {locale === 'fr'
                  ? 'Rendre visible au public'
                  : 'Make visible to public'}
              </p>
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
          onClick={() => router.push(`/${locale}/admin/recipes`)}
        >
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {locale === 'fr' ? 'Enregistrement...' : 'Saving...'}
            </>
          ) : (
            t('save')
          )}
        </Button>
      </div>
    </form>
  );
}
