import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  
  test('all main pages load successfully', async ({ page }) => {
    const pages = ['/', '/docs', '/pricing', '/demo', '/architecture', '/dashboard'];
    
    for (const path of pages) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect([200, 304]).toContain(response?.status());
    }
  });

  test('header is present on all pages', async ({ page }) => {
    const pages = ['/', '/docs', '/pricing'];
    
    for (const path of pages) {
      await page.goto(path);
      const header = page.locator('header').first();
      await expect(header).toBeVisible();
    }
  });

  test('footer is present on main pages', async ({ page }) => {
    const pages = ['/', '/docs', '/pricing'];
    
    for (const path of pages) {
      await page.goto(path);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('deep dive pages are accessible', async ({ page }) => {
    const slugs = ['multimodal-pipeline', 'the-banned-lexicon', 'system-personas', 'human-in-the-loop'];
    
    for (const slug of slugs) {
      const response = await page.goto(`/docs/${slug}`);
      expect([200, 304]).toContain(response?.status());
    }
  });
});
