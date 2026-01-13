import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Roast My Run/i);
  });

  test("displays header elements", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Check for main title text "ROAST MY RUN"
    await expect(
      page.getByRole("heading", { name: "ROAST MY RUN", level: 1 }),
    ).toBeVisible();

    // Check subtitle
    await expect(page.getByText("Get your runs destroyed by AI")).toBeVisible();
  });

  test("displays hero section with Strava connect button", async ({ page }) => {
    // Check for "ABOUT"
    await expect(
      page.getByRole("heading", { name: "ABOUT", level: 2 }),
    ).toBeVisible();

    // Check for About text partial
    await expect(
      page.getByText(/Tired of soft, supportive running communities/i),
    ).toBeVisible();

    const connectButton = page.getByRole("button", {
      name: "CONNECT WITH STRAVA",
    });
    await expect(connectButton).toBeVisible();
    await expect(connectButton).toBeEnabled();
  });

  test("redirects to Strava on connect click", async ({ page }) => {
    const connectButton = page.getByRole("button", {
      name: "CONNECT WITH STRAVA",
    });

    await connectButton.click();
    // Verifying URL change to strava.com
    await expect(page).toHaveURL(/strava\.com/);
  });
});
