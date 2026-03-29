import { describe, expect, it } from 'vitest';
import { sanitizeRecipeBlogHtml } from '@/lib/sanitize-recipe-blog';

describe('sanitizeRecipeBlogHtml', () => {
  it('returns empty string for empty or whitespace input', () => {
    expect(sanitizeRecipeBlogHtml('')).toBe('');
    expect(sanitizeRecipeBlogHtml('   \n\t  ')).toBe('');
  });

  it('allows safe semantic HTML', () => {
    const out = sanitizeRecipeBlogHtml('<p>Hello <strong>world</strong></p>');
    expect(out).toContain('Hello');
    expect(out).toContain('world');
    expect(out).toContain('<p>');
  });

  it('strips script tags', () => {
    const out = sanitizeRecipeBlogHtml(
      '<script>alert(1)</script><p>Safe</p>'
    );
    expect(out.toLowerCase().includes('script')).toBe(false);
    expect(out).toContain('Safe');
  });

  it('strips event handler attributes', () => {
    const out = sanitizeRecipeBlogHtml(
      '<p onclick="alert(1)">Click</p>'
    );
    expect(out).not.toContain('onclick');
    expect(out).toContain('Click');
  });

  it('allows iframe with typical YouTube-style attributes', () => {
    const html =
      '<iframe src="https://www.youtube-nocookie.com/embed/abc" title="t" width="640" height="360" allowfullscreen></iframe>';
    const out = sanitizeRecipeBlogHtml(html);
    expect(out).toContain('iframe');
    expect(out).toContain('youtube-nocookie.com');
  });

  it('strips data-* attributes (ALLOW_DATA_ATTR false)', () => {
    const out = sanitizeRecipeBlogHtml('<p data-x="y">Hi</p>');
    expect(out).not.toContain('data-x');
    expect(out).toContain('Hi');
  });
});
