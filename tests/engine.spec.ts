import { test, expect } from "@playwright/test";

test.describe("WriterHelper Content Engine Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the professional landing page and updated copy", async ({
    page,
  }) => {
    // 1. Resilient Match: Look for a specific chunk of the H1 to bypass <br/> tag issues
    await expect(page.locator("h1")).toContainText(/WINNING SOCIAL MEDIA/i);

    // 2. Resilient Match: Use .first() in case there are mobile/desktop variants of the button
    await expect(
      page.getByRole("button", { name: /TRY IT NOW/i }).first()
    ).toBeVisible();

    // 3. Verify Footer
    const footer = page.locator("footer");
    await expect(footer).toContainText(/CONTENT WIZZES/i);
  });

  test("should navigate to the Context Engine and verify new inputs", async ({
    page,
  }) => {
    // Navigate using the primary CTA
    await page
      .getByRole("button", { name: /TRY IT NOW/i })
      .first()
      .click();

    // 1. Resilient Match: Check for the heading specifically, ignoring case and trailing spaces
    await expect(
      page.getByRole("heading", { name: /CONTEXT ENGINE/i })
    ).toBeVisible();

    // 2. Resilient Match: Target placeholders using partial matches so punctuation doesn't break it
    const urlInput = page.getByPlaceholder(/article URL/i);
    const textInput = page.getByPlaceholder(/additional context/i);
    const generateBtn = page.getByRole("button", {
      name: /GENERATE PERSONALIZED CONTENT/i,
    });

    await expect(urlInput).toBeEnabled();
    await expect(textInput).toBeEnabled();
    await expect(generateBtn).toBeVisible();
  });

  test("should verify the header Home toggle works", async ({ page }) => {
    // Navigate in
    await page
      .getByRole("button", { name: /TRY IT NOW/i })
      .first()
      .click();

    // Click 'HOME' in the header to return
    await page.getByRole("button", { name: /HOME/i }).first().click();

    // Verify we successfully navigated back
    await expect(page.locator("h1")).toContainText(/WINNING SOCIAL MEDIA/i);
  });
});
