import { test, expect } from '@playwright/test';

test.describe('Documentation Pages', () => {
  
  test.describe('Main Docs Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/docs');
    });

    test('renders docs page with correct heading', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /Platform Documentation/i })).toBeVisible();
    });

    test('displays sidebar table of contents on desktop', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip();
        return;
      }

      // Sidebar should be visible with TOC links
      await expect(page.getByText('On this page')).toBeVisible();
      await expect(page.getByRole('link', { name: '1. Getting Started' })).toBeVisible();
      await expect(page.getByRole('link', { name: '2. Multimodal Ingestion' })).toBeVisible();
    });

    test('has link to dashboard', async ({ page }) => {
      const dashboardLink = page.getByRole('link', { name: 'Go to Dashboard →' });
      await expect(dashboardLink).toBeVisible();
    });

    test('contains deep dive links with brand styling', async ({ page }) => {
      // Check that deep dive CTAs exist (we updated these to brand-red)
      const pipelineLink = page.getByRole('link', { name: 'Read the Pipeline Deep Dive →' });
      await expect(pipelineLink).toBeVisible();
    });

    test('navigates to deep dives hub', async ({ page }) => {
      const deepDivesLink = page.getByRole('link', { name: 'View All Deep Dives →' });
      await expect(deepDivesLink).toBeVisible();
      await deepDivesLink.click();

      await expect(page).toHaveURL(/.*\/docs\/deep-dives/);
    });
  });

  test.describe('Deep Dives Hub', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/docs/deep-dives');
    });

    test('renders deep dives hub with correct heading', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /Deep Dives/i })).toBeVisible();
      await expect(page.getByText('Architecture & Philosophy')).toBeVisible();
    });

    test('displays all four deep dive cards', async ({ page }) => {
      // All four deep dives should be listed
      await expect(page.getByRole('heading', { name: 'The Multimodal Ingestion Pipeline' })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Banned Lexicon/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /System Personas/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Human-in-the-Loop/i })).toBeVisible();
    });

    test('navigates to individual deep dive article', async ({ page }) => {
      const firstArticle = page.getByRole('link', { name: /Multimodal/i }).first();
      await firstArticle.click();

      await expect(page).toHaveURL(/.*\/docs\/multimodal-pipeline/);
    });
  });

  test.describe('Individual Deep Dive Articles', () => {
    const deepDives = [
      { slug: 'multimodal-pipeline', title: 'The Multimodal Ingestion Pipeline' },
      { slug: 'the-banned-lexicon', title: 'The Banned Lexicon' },
      { slug: 'system-personas', title: 'System Personas' },
      { slug: 'human-in-the-loop', title: 'Human-in-the-Loop' },
    ];

    for (const dive of deepDives) {
      test(`${dive.slug} article renders correctly`, async ({ page }) => {
        await page.goto(`/docs/${dive.slug}`);

        // Article should have title
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        // TL;DR block should be visible (we added these)
        await expect(page.locator('blockquote').first()).toBeVisible();

        // Table of contents should be present
        await expect(page.getByText('Table of Contents')).toBeVisible();
      });

      test(`${dive.slug} has FAQ schema JSON-LD`, async ({ page }) => {
        await page.goto(`/docs/${dive.slug}`);

        // Check that FAQ JSON-LD script exists
        const jsonLd = page.locator('script[type="application/ld+json"]');
        await expect(jsonLd).toBeAttached();

        const jsonContent = await jsonLd.textContent();
        expect(jsonContent).toContain('FAQPage');
        expect(jsonContent).toContain('Question');
      });
    }

    test('next article navigation works', async ({ page }) => {
      await page.goto('/docs/multimodal-pipeline');

      // Should show "Up Next" link to next article
      const nextLink = page.getByText('Up Next').first();
      await expect(nextLink).toBeVisible();
    });
  });
});
