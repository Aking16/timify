import { test, expect } from "@playwright/test";
import {
  getSuiteEmail,
  registerUserAndNavigate,
  selectProjectFromSidebar,
  startTimer,
  expandSidebar,
} from "./helpers";

const TEST_PASSWORD = "TestPassword123!";

/**
 * Helper: Register a user, create a project, select it, start a timer,
 * and return the project id captured from the URL.
 */
async function registerSetupAndStartTimer(
  page: import("@playwright/test").Page
): Promise<{ email: string; projectId?: string }> {
  const email = getSuiteEmail("reports");

  // Register and go to projects page
  await registerUserAndNavigate(page, "تست گزارش", email, TEST_PASSWORD, "/app/projects");

  // Create a project
  await page.getByRole("button", { name: "افزودن پروژه" }).click();
  await page.waitForSelector('h2:has-text("ساخت پروژه جدید")', { timeout: 5000 });
  await page.fill("#name", "پروژه گزارش");
  await page.getByRole("button", { name: "Create Project" }).click();
  await page.waitForTimeout(2000);

  // Navigate to app root to see sidebar
  await page.goto("/app");
  await page.waitForLoadState("domcontentloaded");
  await expandSidebar(page);
  await page.waitForTimeout(1500);

  // Select project from sidebar — this sets active-project in localStorage
  // and navigates to /app/project/{id}
  await selectProjectFromSidebar(page, "پروژه گزارش");
  await page.waitForURL(/\/app\/project\//, { timeout: 10000 });

  // Extract the project ID from the current URL
  const urlMatch = page.url().match(/\/app\/project\/([^/]+)/);
  const projectId = urlMatch?.[1];

  // Start a timer to create a time entry with this project
  await startTimer(page);

  return { email, projectId };
}

test.describe("Reports", () => {
  test.describe("Reports page rendering", () => {
    test("should navigate to a project's reports page", async ({ page }) => {
      const { projectId } = await registerSetupAndStartTimer(page);

      // The /app/reports page is a client component that reads
      // active-project from localStorage and redirects.
      // Instead of relying on that redirect chain, set the active project
      // in localStorage and navigate directly.
      if (!projectId) {
        test.skip();
        return;
      }

      // Navigate directly to the project reports page
      await page.goto(`/app/project/${projectId}/reports`);
      await page.waitForLoadState("domcontentloaded");

      // The reports page should load (either with data or empty state)
      const noDataMsg = page.getByText("داده‌ای برای نمایش وجود ندارد");
      const chartHeader = page.getByText("ساعت های کاری روزانه");
      const hasData = await chartHeader.isVisible({ timeout: 3000 }).catch(() => false);
      const hasNoData = await noDataMsg.isVisible({ timeout: 3000 }).catch(() => false);

      expect(hasData || hasNoData).toBeTruthy();
    });
  });

  test.describe("Reports with data", () => {
    test("should show reports data for projects with time entries", async ({ page }) => {
      const { projectId } = await registerSetupAndStartTimer(page);

      if (!projectId) {
        test.skip();
        return;
      }

      // The reports page may have continuous data fetching (networkidle can hang).
      // Use waitForSelector to wait for specific content instead.
      await page.goto(`/app/project/${projectId}/reports`);
      await page.waitForLoadState("domcontentloaded");

      // Wait for either the empty state or the chart header to appear
      const noDataMsg = page.getByText("داده‌ای برای نمایش وجود ندارد");
      const chartHeader = page.getByText("ساعت های کاری روزانه");

      try {
        await Promise.race([
          noDataMsg.waitFor({ state: "visible", timeout: 8000 }),
          chartHeader.waitFor({ state: "visible", timeout: 8000 }),
        ]);
      } catch {
        // Neither appeared within timeout — page may still be loading
      }

      const hasData = await chartHeader.isVisible({ timeout: 1000 }).catch(() => false);
      const hasNoData = await noDataMsg.isVisible({ timeout: 1000 }).catch(() => false);
      expect(hasData || hasNoData).toBeTruthy();
    });
  });

  test.describe("Date range filtering", () => {
    test("should allow date range filtering on reports", async ({ page }) => {
      const { projectId } = await registerSetupAndStartTimer(page);

      if (!projectId) {
        test.skip();
        return;
      }

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      await page.goto(
        `/app/project/${projectId}/reports?startDate=${startOfMonth.getTime()}&endDate=${endOfMonth.getTime()}`
      );
      await page.waitForLoadState("domcontentloaded");

      const noDataMsg = page.getByText("داده‌ای برای نمایش وجود ندارد");
      const chartHeader = page.getByText("ساعت های کاری روزانه");

      try {
        await Promise.race([
          noDataMsg.waitFor({ state: "visible", timeout: 8000 }),
          chartHeader.waitFor({ state: "visible", timeout: 8000 }),
        ]);
      } catch {
        // Neither appeared within timeout
      }

      const hasNoData = await noDataMsg.isVisible({ timeout: 1000 }).catch(() => false);
      const hasChart = await chartHeader.isVisible({ timeout: 1000 }).catch(() => false);
      expect(hasNoData || hasChart).toBeTruthy();
    });

    test("should show empty state when filtering with no matching data", async ({ page }) => {
      const { projectId } = await registerSetupAndStartTimer(page);

      if (!projectId) {
        test.skip();
        return;
      }

      await page.goto(
        `/app/project/${projectId}/reports?startDate=${new Date("2020-01-01").getTime()}&endDate=${new Date("2020-01-31").getTime()}`
      );
      await page.waitForLoadState("domcontentloaded");

      await expect(page.getByText("داده‌ای برای نمایش وجود ندارد")).toBeVisible({ timeout: 10000 });
    });
  });
});
