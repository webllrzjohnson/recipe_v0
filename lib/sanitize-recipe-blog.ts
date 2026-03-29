import DOMPurify from 'isomorphic-dompurify';

const RECIPE_BLOG_SANITIZE = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: [
    'allow',
    'allowfullscreen',
    'src',
    'width',
    'height',
    'data-youtube-video',
    'frameborder',
    'title',
    'target',
    'rel',
    'class',
    'loading',
    'referrerpolicy',
    'start',
  ],
  ALLOW_DATA_ATTR: false,
};

export function sanitizeRecipeBlogHtml(dirty: string): string {
  const trimmed = dirty?.trim() ?? '';
  if (!trimmed) return '';
  return DOMPurify.sanitize(trimmed, RECIPE_BLOG_SANITIZE);
}
