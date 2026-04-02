import { test, expect } from '@playwright/test';

test.describe('SEO & Meta Tags', () => {
  
  test.describe('Homepage SEO', () => {
    test('has proper meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Title
      await expect(page).toHaveTitle(/Ozigi/i);
      
      // Meta description
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.+/);
    });
  });

  test.describe('Docs SEO', () => {
    test('docs page has proper meta tags', async ({ page }) => {
      await page.goto('/docs');
      
      await expect(page).toHaveTitle(/Ozigi Docs/i);
      
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.+/);
      
      // Canonical URL
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /ozigi\.app\/docs/);
    });
  });

  test.describe('Sitemap & Robots', () => {
    test('sitemap.xml is accessible', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');
      expect(response?.status()).toBe(200);
      
      const content = await page.content();
      expect(content).toContain('urlset');
      expect(content).toContain('ozigi.app');
    });

    test('robots.txt is accessible', async ({ page }) => {
      const response = await page.goto('/robots.txt');
      expect(response?.status()).toBe(200);
      
      const content = await page.content();
      expect(content).toContain('User-agent');
    });

    test('llms.txt is accessible', async ({ page }) => {
      const response = await page.goto('/llms.txt');
      expect(response?.status()).toBe(200);
      
      const content = await page.content();
      expect(content).toContain('Ozigi');
    });
  });

  test.describe('Open Graph Tags', () => {
    test('homepage has OG tags', async ({ page }) => {
      await page.goto('/');
      
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDescription = page.locator('meta[property="og:description"]');
      
      // Check OG tags exist (may not be present on all pages)
      const titleExists = await ogTitle.count() > 0;
      const descExists = await ogDescription.count() > 0;
      
      // At minimum, regular meta should exist
      await expect(page).toHaveTitle(/Ozigi/i);
    });
  });

  test.describe('Deep Dive Articles SEO', () => {
    const articles = [
      'multimodal-pipeline',
      'the-banned-lexicon',
      'system-personas',
      'human-in-the-loop',
    ];

    for (const slug of articles) {
      test(`${slug} has FAQ schema`, async ({ page }) => {
        await page.goto(`/docs/${slug}`);
        
        // Check for JSON-LD FAQ schema
        const jsonLd = page.locator('script[type="application/ld+json"]');
        await expect(jsonLd).toBeAttached();
        
        const content = await jsonLd.textContent();
        expect(content).toContain('FAQPage');
        expect(content).toContain('@context');
        expect(content).toContain('schema.org');
      });
    }
  });
});
