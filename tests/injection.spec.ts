import { test, expect } from "@playwright/test";

test("should generate a campaign from a valid URL", async ({ page }) => {
  await page.goto("/");

  // 1. Enter the URL
  const input = page.getByPlaceholder("Source article URL...");
  await input.fill("https://dev.to/dumebii/your-article-link");

  // 2. Trigger the Architect
  const generateBtn = page.getByRole("button", { name: /Architect/i });
  await generateBtn.click();

  // 3. Verify the "Reasoning" state appears
  await expect(page.getByText(/Reasoning.../i)).toBeVisible();

  // 4. Verify the Kanban columns load
  await expect(page.getByText(/X Pipeline/i)).toBeVisible({ timeout: 15000 });
});
