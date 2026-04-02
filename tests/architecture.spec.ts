import { test, expect } from '@playwright/test';

test.describe('Architecture Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/architecture');
  });

  test('renders architecture page', async ({ page }) => {
    // Wait for page to load (has charts that need JS)
    await page.waitForLoadState('networkidle');

    // Should have architecture content
    await expect(page.locator('main')).toBeVisible();
  });

  test('displays tab navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Architecture page has tabs for different sections
    const tabButtons = page.getByRole('button');
    await expect(tabButtons.first()).toBeVisible();
  });

  test('header and footer are present', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('page loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/architecture');
    await page.waitForLoadState('networkidle');

    // Filter out known benign errors (e.g., third-party scripts)
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('third-party')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
