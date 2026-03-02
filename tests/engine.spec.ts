import { test, expect } from '@playwright/test';

test.describe('Ozigi Content Engine Workflow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the landing page and new Ozigi branding', async ({ page }) => {
    // 1. Resilient H1 Match
    await expect(page.locator('h1')).toContainText(/WINNING SOCIAL MEDIA/i);
    
    // 2. Button Match: MUST match the aria-label, not the inner text!
    await expect(page.getByRole('button', { name: /Try the Context Engine Now/i })).toBeVisible();

    // 3. Brand & Auth Match
    await expect(page.locator('nav')).toContainText(/Ozigi/i);
    await expect(page.getByRole('button', { name: /Connect to Github/i })).toBeVisible();
  });

  test('should navigate to the Context Engine and verify inputs', async ({ page }) => {
    // Click the Hero CTA using the aria-label
    await page.getByRole('button', { name: /Try the Context Engine Now/i }).click();

    // Verify the URL input exists
    const urlInput = page.getByPlaceholder(/Paste your article URL here/i);
    await expect(urlInput).toBeVisible();

    // Verify the Notes textarea exists
    const textInput = page.getByPlaceholder(/Add additional context: meeting minutes/i);
    await expect(textInput).toBeVisible();

    // Verify Generate button
    const generateBtn = page.getByRole('button', { name: /Generate Personalized Content/i });
    await expect(generateBtn).toBeVisible();
    await expect(generateBtn).toBeDisabled();
  });

  test('should verify the responsive header Home toggle works', async ({ page }) => {
    // Navigate to the dashboard using the aria-label
    await page.getByRole('button', { name: /Try the Context Engine Now/i }).click();
    
    // Verify we are on the dashboard
    await expect(page.locator('h2')).toContainText(/Context Engine/i);

    // Click the "Home" button in the header
    await page.getByRole('button', { name: /^Home$/i }).click();
    
    // Verify we navigated back
    await expect(page.locator('h1')).toContainText(/WINNING SOCIAL MEDIA/i);
  });
});