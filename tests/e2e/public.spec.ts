import { test, expect } from '@playwright/test';

test.describe('public pages (no auth)', () => {
  test('about page responds', async ({ page }) => {
    const res = await page.goto('/about');
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('robots.txt references sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text.toLowerCase()).toContain('sitemap');
  });

  test('legal compliance pages return OK', async ({ page }) => {
    for (const path of ['/privacy', '/terms', '/disclaimer', '/cookies']) {
      const res = await page.goto(path);
      expect(res?.ok(), path).toBeTruthy();
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('home, recipes, and blog return OK', async ({ page }) => {
    let res = await page.goto('/');
    expect(res?.ok(), 'GET / — set NEXT_PUBLIC_SUPABASE_* if this fails').toBeTruthy();

    res = await page.goto('/recipes');
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator('h1')).toBeVisible();

    res = await page.goto('/blog');
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator('h1')).toBeVisible();
  });
});
