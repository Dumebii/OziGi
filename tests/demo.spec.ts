import { test, expect } from '@playwright/test';

test.describe('Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
  });

  test('renders demo page with context engine', async ({ page }) => {
    // Demo page should show the context engine
    await expect(page.getByText('Context Engine')).toBeVisible();
  });

  test('displays input tabs (Link, Notes, Files)', async ({ page }) => {
    // Check for input method tabs
    await expect(page.getByRole('button', { name: /Link/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Notes/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Files/i })).toBeVisible();
  });

  test('URL input is visible by default', async ({ page }) => {
    const urlInput = page.getByPlaceholder(/Paste an article or blog post URL/i);
    await expect(urlInput).toBeVisible();
  });

  test('can switch to Notes tab and see text input', async ({ page }) => {
    await page.getByRole('button', { name: /Notes/i }).click();
    const textInput = page.getByPlaceholder(/Paste your raw thoughts/i);
    await expect(textInput).toBeVisible();
  });

  test('can switch to Files tab and see upload option', async ({ page }) => {
    await page.getByRole('button', { name: /Files/i }).click();
    await expect(page.getByText(/Upload PDF or Image/i)).toBeVisible();
  });

  test('generate button is present', async ({ page }) => {
    const generateBtn = page.getByRole('button', { name: /Generate/i });
    await expect(generateBtn).toBeVisible();
  });

  test('header and footer are present', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
