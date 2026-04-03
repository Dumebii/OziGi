import { test, expect } from '@playwright/test';

test.describe('SEO & Meta Tags', () => {
  
  test('homepage has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ozigi/i);
  });

  test('homepage has meta description', async ({ page }) => {
    await page.goto('/');
    
    const description = page.locator('meta[name="description"]');
    const count = await description.count();
    expect(count).toBeGreaterThan(0);
  });

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('urlset');
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('User-agent');
  });

  test('llms.txt is accessible', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    
    // May not exist on all deployments yet
    if (response?.status() === 200) {
      const content = await page.content();
      expect(content.toLowerCase()).toContain('ozigi');
    }
  });
});
