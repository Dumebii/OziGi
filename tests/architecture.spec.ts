import { test, expect } from '@playwright/test';

test.describe('Architecture Page', () => {
  test('architecture page loads successfully', async ({ page }) => {
    const response = await page.goto('/architecture', { waitUntil: 'domcontentloaded' });
    expect([200, 304]).toContain(response?.status());
  });

  test('has visible content', async ({ page }) => {
    await page.goto('/architecture');
    
    const main = page.locator('main');
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('has header and footer', async ({ page }) => {
    await page.goto('/architecture');
    
    const header = page.locator('header').first();
    const footer = page.locator('footer');
    
    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
  });

  test('no JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    
    await page.goto('/architecture');
    await page.waitForTimeout(2000);
    
    // Filter benign errors (ResizeObserver, third-party)
    const criticalErrors = errors.filter(
      e => !e.includes('ResizeObserver') && !e.includes('third-party')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
