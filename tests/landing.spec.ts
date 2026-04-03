import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('renders hero section', async ({ page }) => {
    // Check hero headline exists
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible({ timeout: 10000 });
  });

  test('header is visible', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('has primary CTA links', async ({ page }) => {
    // At least one CTA link should exist
    const ctaLinks = page.getByRole('link');
    const count = await ctaLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('footer renders', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('page has title containing Ozigi', async ({ page }) => {
    await expect(page).toHaveTitle(/Ozigi/i);
  });

  test('no JavaScript errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    expect(errors).toHaveLength(0);
  });
});
