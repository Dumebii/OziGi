import { test, expect } from "@playwright/test";

test("should allow inline editing of generated posts", async ({ page }) => {
  const editBtn = page.locator('button:has-text("Edit")').first();
  await editBtn.click();

  const textarea = page.locator("textarea");
  await textarea.fill("This is a manual edit for the 5G optimization post.");

  const saveBtn = page.getByText("Save");
  await saveBtn.click();

  await expect(page.getByText("This is a manual edit")).toBeVisible();
});
