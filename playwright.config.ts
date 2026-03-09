import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", // Update this if your tests are in an 'e2e' folder
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

/* Run your local dev server before starting the tests */
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000, // Give Next.js 2 minutes to compile initially
},
use: {
  /* Base URL to use in actions like `await page.goto('/')`. */
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',
},

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
});
