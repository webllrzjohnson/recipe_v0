import { sanitizeRecipeBlogHtml } from '@/lib/sanitize-recipe-blog';

export function RecipeBlog({
  html,
  heading,
}: {
  html: string | null | undefined;
  heading?: string;
}) {
  const raw = html?.trim();
  if (!raw) return null;
  const clean = sanitizeRecipeBlogHtml(raw);
  if (!clean.trim()) return null;
  return (
    <section className="mb-10 text-left sm:mb-12" aria-label={heading}>
      {heading ? (
        <h2 className="mb-4 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
          {heading}
        </h2>
      ) : null}
      <div
        className="recipe-blog-content"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </section>
  );
}
