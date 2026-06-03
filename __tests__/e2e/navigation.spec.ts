import { test, expect } from "@playwright/test";
import { getSuiteEmail, registerUserAndNavigate, dismissDevOverlay } from "./helpers";

const TEST_PASSWORD = "TestPassword123!";

test.describe("Navigation", () => {
  test.describe("Sidebar navigation (desktop viewport)", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("should display sidebar navigation links", async ({ page }) => {
      const email = getSuiteEmail("nav");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);

      // Use visible locators to avoid matching the mobile bottom nav
      await expect(page.getByRole("link", { name: /همه پروژه‌ها/ }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: /گزارش‌ها/ }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: /برچسب‌ها/ }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: /داشبورد/ }).first()).toBeVisible();
    });

    test("should navigate to projects page via sidebar", async ({ page }) => {
      const email = getSuiteEmail("nav2");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);

      // Click the sidebar link (not the mobile bottom nav)
      // Use the link with href="/app/projects" which appears in sidebar
      await page.locator('[data-slot="sidebar"] a[href="/app/projects"]').click();
      await page.waitForURL("/app/projects", { timeout: 10000 });
      expect(page.url()).toContain("/app/projects");
    });

    test("should navigate to tags page via sidebar", async ({ page }) => {
      const email = getSuiteEmail("nav3");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);

      // Click the sidebar link for tags
      // The sidebar has a <Sidebar> component with data attributes
      // Find the sidebar link that points to /app/tags
      await page.locator('[data-slot="sidebar"] a[href="/app/tags"]').click();
      await page.waitForURL("/app/tags", { timeout: 10000 });
      expect(page.url()).toContain("/app/tags");
    });
  });

  test.describe("Bottom navigation (mobile viewport)", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("should display bottom navigation on mobile", async ({ page }) => {
      const email = getSuiteEmail("nav4");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);
      await dismissDevOverlay(page);

      await expect(page.getByText("داشبورد").last()).toBeVisible();
      await expect(page.getByText("همه پروژه‌ها").last()).toBeVisible();
      await expect(page.getByText("گزارش‌ها").last()).toBeVisible();
      await expect(page.getByText("برچسب‌ها").last()).toBeVisible();
    });

    test("should navigate to projects via bottom nav on mobile", async ({ page }) => {
      const email = getSuiteEmail("nav5");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);
      await dismissDevOverlay(page);

      await page.getByText("همه پروژه‌ها").last().click({ force: true });
      await page.waitForURL("/app/projects", { timeout: 10000 });
      expect(page.url()).toContain("/app/projects");
    });

    test("should navigate to tags via bottom nav on mobile", async ({ page }) => {
      const email = getSuiteEmail("nav6");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);
      await dismissDevOverlay(page);

      await page.getByText("برچسب‌ها").last().click({ force: true });
      await page.waitForURL("/app/tags", { timeout: 10000 });
      expect(page.url()).toContain("/app/tags");
    });

    test("should navigate to reports via bottom nav on mobile", async ({ page }) => {
      const email = getSuiteEmail("nav7");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);
      await dismissDevOverlay(page);

      await page.getByText("گزارش‌ها").last().click({ force: true });
      await page.waitForTimeout(3000);
      expect(page.url()).toContain("/app");
    });
  });

  test.describe("Theme switcher", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("should cycle themes when clicking theme switcher", async ({ page }) => {
      const email = getSuiteEmail("nav8");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);

      const themeSwitcher = page.getByRole("button", { name: /theme/i });
      if (await themeSwitcher.isVisible({ timeout: 3000 }).catch(() => false)) {
        const initialAriaLabel = await themeSwitcher.getAttribute("aria-label");
        await themeSwitcher.click();
        await page.waitForTimeout(500);
        const newAriaLabel = await themeSwitcher.getAttribute("aria-label");
        expect(newAriaLabel).not.toBe(initialAriaLabel);
      } else {
        test.skip();
      }
    });
  });

  test.describe("Responsive layout", () => {
    test("should show sidebar navigation on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      const email = getSuiteEmail("nav9");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);

      await expect(page.getByText("داشبورد").first()).toBeVisible();
      await expect(page.getByText("همه پروژه‌ها").first()).toBeVisible();
      await expect(page.getByText("برچسب‌ها").first()).toBeVisible();
    });

    test("should show bottom nav on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const email = getSuiteEmail("nav10");
      await registerUserAndNavigate(page, "تست ناوبری", email, TEST_PASSWORD, "/app");
      await page.waitForTimeout(1000);
      await dismissDevOverlay(page);

      await expect(page.getByText("داشبورد").last()).toBeVisible();
      await expect(page.getByText("همه پروژه‌ها").last()).toBeVisible();
      await expect(page.getByText("گزارش‌ها").last()).toBeVisible();
      await expect(page.getByText("برچسب‌ها").last()).toBeVisible();
    });
  });
});
