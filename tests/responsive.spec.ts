import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  
  test.describe('Mobile Layout (375px)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('landing page loads on mobile', async ({ page }) => {
      await page.goto('/');
      
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible({ timeout: 10000 });
    });

    test('no horizontal overflow on mobile', async ({ page }) => {
      await page.goto('/');
      
      const body = page.locator('body');
      const scrollWidth = await body.evaluate((el) => el.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(385); // viewport + small tolerance
    });

    test('docs page loads on mobile', async ({ page }) => {
      await page.goto('/docs');
      
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Tablet Layout (768px)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('landing page loads on tablet', async ({ page }) => {
      await page.goto('/');
      
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible({ timeout: 10000 });
    });

    test('pricing page loads on tablet', async ({ page }) => {
      await page.goto('/pricing');
      
      const response = await page.goto('/pricing');
      expect([200, 304]).toContain(response?.status());
    });
  });

  test.describe('Desktop Layout (1440px)', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('landing page loads on desktop', async ({ page }) => {
      await page.goto('/');
      
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible({ timeout: 10000 });
    });

    test('docs page loads on desktop', async ({ page }) => {
      await page.goto('/docs');
      
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    });
  });
});
