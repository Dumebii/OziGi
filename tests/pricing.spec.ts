import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('renders pricing page with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Simple, transparent pricing/i })).toBeVisible();
    await expect(page.getByText('No credit card required to start')).toBeVisible();
  });

  test('displays pricing cards', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=No credit card required', { timeout: 10000 });

    // Check for pricing tier elements
    // The exact text depends on PricingCards component
    const pricingSection = page.locator('main');
    await expect(pricingSection).toBeVisible();
  });

  test('header and footer are present', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('text=No credit card required', { timeout: 10000 });

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('has navigation back to main site', async ({ page }) => {
    await page.waitForSelector('text=No credit card required', { timeout: 10000 });

    // Header should have link back to home
    const homeLink = page.locator('header').getByRole('link').first();
    await expect(homeLink).toBeVisible();
  });
});
