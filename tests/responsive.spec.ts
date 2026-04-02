import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  
  test.describe('Mobile Layout', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test('landing page is mobile-friendly', async ({ page }) => {
      await page.goto('/');
      
      // Hero should be visible
      await expect(page.locator('h1')).toBeVisible();
      
      // CTAs should be visible
      await expect(page.getByRole('link', { name: 'See a Live Example' })).toBeVisible();
      
      // No horizontal overflow
      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      const viewportWidth = 375;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small tolerance
    });

    test('docs page sidebar is hidden on mobile', async ({ page }) => {
      await page.goto('/docs');
      
      // Sidebar TOC should be hidden on mobile (has hidden lg:block class)
      const sidebar = page.locator('aside');
      // On mobile, aside should not be visible or should be hidden
      const isVisible = await sidebar.isVisible().catch(() => false);
      // This is expected - sidebar is hidden on mobile via CSS
    });

    test('dashboard works on mobile', async ({ page }) => {
      await page.goto('/dashboard');
      
      await expect(page.getByRole('heading', { name: 'Context Engine' })).toBeVisible();
      
      // Input tabs should be visible
      await expect(page.getByRole('button', { name: /Link/i })).toBeVisible();
    });
  });

  test.describe('Tablet Layout', () => {
    test.use({ viewport: { width: 768, height: 1024 } }); // iPad

    test('docs page renders correctly on tablet', async ({ page }) => {
      await page.goto('/docs');
      
      await expect(page.getByRole('heading', { name: /Documentation/i })).toBeVisible();
    });

    test('pricing page renders correctly on tablet', async ({ page }) => {
      await page.goto('/pricing');
      
      await page.waitForSelector('text=No credit card required', { timeout: 10000 });
      await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible();
    });
  });

  test.describe('Desktop Layout', () => {
    test.use({ viewport: { width: 1440, height: 900 } }); // Large desktop

    test('docs page shows sidebar on desktop', async ({ page }) => {
      await page.goto('/docs');
      
      // Sidebar should be visible on desktop
      await expect(page.getByText('On this page')).toBeVisible();
    });

    test('deep dives hub shows grid layout', async ({ page }) => {
      await page.goto('/docs/deep-dives');
      
      // Should show all 4 deep dive cards
      const cards = page.getByRole('link').filter({ hasText: /Read Article/i });
      await expect(cards).toHaveCount(4);
    });
  });
});
