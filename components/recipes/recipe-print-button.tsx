'use client';

import { copy } from '@/lib/copy';

const rc = copy.recipe;

/** Print-friendly trigger; matches “Print recipe” pattern on recipe card templates */
export function RecipePrintButton({ className }: { className?: string }) {

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        'bg-transparent p-0 underline underline-offset-4 decoration-[#474747]/35 hover:decoration-primary dark:decoration-muted-foreground/50'
      }
    >
      {rc.printRecipe}
    </button>
  );
}
