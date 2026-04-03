import { test, expect } from '@playwright/test';

test.describe('Demo Page', () => {
  test('demo page loads successfully', async ({ page }) => {
    const response = await page.goto('/demo', { waitUntil: 'domcontentloaded' });
    expect([200, 304]).toContain(response?.status());
  });

  test('has visible content', async ({ page }) => {
    await page.goto('/demo');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    const text = await body.textContent();
    expect(text?.length).toBeGreaterThan(100);
  });

  test('has header and footer', async ({ page }) => {
    await page.goto('/demo');
    
    const header = page.locator('header').first();
    const footer = page.locator('footer');
    
    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
  });

  test('no JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    
    await page.goto('/demo');
    await page.waitForTimeout(2000);
    
    // Filter benign errors
    const criticalErrors = errors.filter(e => !e.includes('ResizeObserver'));
    expect(criticalErrors).toHaveLength(0);
  });
});
