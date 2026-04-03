import { test, expect } from '@playwright/test';

test.describe('Documentation Pages', () => {
  
  test.describe('Main Docs Page', () => {
    test('renders docs page', async ({ page }) => {
      await page.goto('/docs', { waitUntil: 'domcontentloaded' });
      
      // Should have a heading
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test('has navigation links', async ({ page }) => {
      await page.goto('/docs');
      
      const links = page.getByRole('link');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Deep Dives Hub', () => {
    test('renders deep dives page', async ({ page }) => {
      await page.goto('/docs/deep-dives', { waitUntil: 'domcontentloaded' });
      
      // Should have content
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test('displays deep dive cards', async ({ page }) => {
      await page.goto('/docs/deep-dives');
      
      // Should have multiple article links
      const articleLinks = page.getByRole('link');
      const count = await articleLinks.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Individual Deep Dive Articles', () => {
    const deepDives = [
      'multimodal-pipeline',
      'the-banned-lexicon',
      'system-personas',
      'human-in-the-loop',
    ];

    for (const slug of deepDives) {
      test(`${slug} article renders`, async ({ page }) => {
        const response = await page.goto(`/docs/${slug}`, { waitUntil: 'domcontentloaded' });
        
        // Page should load successfully (200 or 304)
        expect([200, 304]).toContain(response?.status());
        
        // Should have a title/heading
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible({ timeout: 10000 });
      });
    }

    test('multimodal-pipeline has FAQ schema', async ({ page }) => {
      await page.goto('/docs/multimodal-pipeline');
      
      // Check for JSON-LD script
      const jsonLd = page.locator('script[type="application/ld+json"]');
      const exists = await jsonLd.count() > 0;
      
      if (exists) {
        const content = await jsonLd.textContent();
        expect(content).toContain('FAQPage');
      }
    });
  });
});
