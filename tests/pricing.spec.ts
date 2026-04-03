import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('pricing page loads successfully', async ({ page }) => {
    const response = await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
    expect([200, 304]).toContain(response?.status());
  });

  test('has visible content', async ({ page }) => {
    await page.goto('/pricing');
    
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('has header and footer', async ({ page }) => {
    await page.goto('/pricing');
    
    const header = page.locator('header').first();
    const footer = page.locator('footer');
    
    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
  });

  test('no JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    
    await page.goto('/pricing');
    await page.waitForTimeout(2000);
    
    // Filter benign errors
    const criticalErrors = errors.filter(e => !e.includes('ResizeObserver'));
    expect(criticalErrors).toHaveLength(0);
  });
});
