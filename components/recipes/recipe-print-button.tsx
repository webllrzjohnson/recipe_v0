'use client';

import { useTranslations } from 'next-intl';

/** Print-friendly trigger; matches “Print recipe” pattern on recipe card templates */
export function RecipePrintButton({ className }: { className?: string }) {
  const t = useTranslations('recipe');

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        'bg-transparent p-0 underline underline-offset-4 decoration-[#474747]/35 hover:decoration-primary dark:decoration-muted-foreground/50'
      }
    >
      {t('printRecipe')}
    </button>
  );
}
