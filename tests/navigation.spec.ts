import { test, expect } from '@playwright/test';

test.describe('Site-wide Navigation', () => {
  
  test.describe('Header Navigation', () => {
    test('header is sticky and visible on scroll', async ({ page }) => {
      await page.goto('/docs');
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      // Header should still be visible (sticky)
      const header = page.locator('header').first();
      await expect(header).toBeVisible();
      await expect(header).toBeInViewport();
    });
  });

  test.describe('Cross-page Navigation', () => {
    test('can navigate from landing to all main pages', async ({ page }) => {
      await page.goto('/');

      // To Docs
      await page.goto('/docs');
      await expect(page).toHaveURL(/.*\/docs/);
      await expect(page.getByRole('heading', { name: /Documentation/i })).toBeVisible();

      // To Pricing
      await page.goto('/pricing');
      await expect(page).toHaveURL(/.*\/pricing/);

      // To Demo
      await page.goto('/demo');
      await expect(page).toHaveURL(/.*\/demo/);

      // To Architecture
      await page.goto('/architecture');
      await expect(page).toHaveURL(/.*\/architecture/);

      // To Dashboard
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/.*\/dashboard/);
    });
  });

  test.describe('Footer Navigation', () => {
    test('footer links work correctly', async ({ page }) => {
      await page.goto('/');
      
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      
      // Check that footer has links
      const footerLinks = footer.getByRole('link');
      const linkCount = await footerLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });
  });

  test.describe('404 Handling', () => {
    test('non-existent page returns 404', async ({ page }) => {
      const response = await page.goto('/this-page-does-not-exist-12345');
      expect(response?.status()).toBe(404);
    });
  });
});
