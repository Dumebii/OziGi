import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section with correct branding', async ({ page }) => {
    // Check hero headline
    await expect(page.locator('h1')).toContainText('The Intelligent');
    await expect(page.getByText('Content Engine', { exact: true }).first()).toBeVisible();

    // Check "New" badge
    await expect(page.getByText('New: Multi-platform content campaigns')).toBeVisible();

    // Check primary CTAs
    await expect(page.getByRole('link', { name: 'See a Live Example' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In to Build' })).toBeVisible();
  });

  test('header contains navigation links', async ({ page }) => {
    // Header should have key navigation elements
    await expect(page.getByRole('link', { name: 'Try It Now' }).first()).toBeVisible();
  });

  test('navigates to dashboard via Try It Now', async ({ page }) => {
    const tryItNowBtn = page.getByRole('link', { name: 'Try It Now' }).first();
    await expect(tryItNowBtn).toBeVisible();
    await tryItNowBtn.click({ force: true });

    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Context Engine' })).toBeVisible();
  });

  test('navigates to demo via See a Live Example', async ({ page }) => {
    const demoLink = page.getByRole('link', { name: 'See a Live Example' });
    await expect(demoLink).toBeVisible();
    await demoLink.click();

    await expect(page).toHaveURL(/.*\/demo/);
  });

  test('footer renders with expected links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for important footer links
    await expect(footer.getByRole('link', { name: /pricing/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /docs/i })).toBeVisible();
  });

  test('page has correct meta title', async ({ page }) => {
    await expect(page).toHaveTitle(/Ozigi/i);
  });
});
