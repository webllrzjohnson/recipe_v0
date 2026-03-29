import { sanitizeRecipeBlogHtml } from '@/lib/sanitize-recipe-blog';

export function BlogPostBody({
  html,
  className,
}: {
  html: string | null | undefined;
  className?: string;
}) {
  const raw = html?.trim();
  if (!raw) return null;
  const clean = sanitizeRecipeBlogHtml(raw);
  if (!clean.trim()) return null;
  return (
    <div
      className={className ?? 'blog-post-content prose prose-neutral max-w-none dark:prose-invert'}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
