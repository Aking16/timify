import { test, expect } from "@playwright/test";
import { getSuiteEmail, registerUserAndNavigate } from "./helpers";

const TEST_PASSWORD = "TestPassword123!";

test.describe("Countdown Page", () => {
  test.describe("Page rendering", () => {
    test("should render the countdown page with correct title", async ({ page }) => {
      const email = getSuiteEmail("countdown1");
      await registerUserAndNavigate(page, "تست شمارش", email, TEST_PASSWORD, "/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      await expect(page.getByText("شمارش معکوس").first()).toBeVisible();
    });

    test("should show empty state when no countdowns exist", async ({ page }) => {
      const email = getSuiteEmail("countdown2");
      await registerUserAndNavigate(page, "تست شمارش", email, TEST_PASSWORD, "/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      await expect(page.getByText("هیچ شمارش معکوسی وجود ندارد")).toBeVisible();
    });
  });

  test.describe("Create countdown", () => {
    test("should open create dialog when clicking create button", async ({ page }) => {
      const email = getSuiteEmail("countdown3");
      await registerUserAndNavigate(page, "تست شمارش", email, TEST_PASSWORD, "/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      await page.getByRole("button", { name: "ساخت شمارش معکوس" }).click();
      await expect(page.getByRole("heading", { name: "شمارش معکوس جدید" })).toBeVisible();
    });

    test("should create a countdown successfully", async ({ page }) => {
      const email = getSuiteEmail("countdown4");
      await registerUserAndNavigate(page, "تست شمارش", email, TEST_PASSWORD, "/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      await page.getByRole("button", { name: "ساخت شمارش معکوس" }).click();
      await page.waitForTimeout(500);

      await page.locator("#title").fill("تمرکز ۳۰ دقیقه");
      await page.locator('#create-countdown-form input:not([type="hidden"])').nth(2).fill("30");

      await page.getByRole("button", { name: /ساخت/ }).last().click();
      await page.waitForTimeout(2000);

      await page.goto("/app/countdown");
      await page.waitForLoadState("domcontentloaded");
      await expect(page.getByText("تمرکز ۳۰ دقیقه").first()).toBeVisible();
    });
  });

  test.describe("Countdown card controls", () => {
    test("should show play button on countdown card", async ({ page }) => {
      const email = getSuiteEmail("countdown5");
      await registerUserAndNavigate(page, "تست شمارش", email, TEST_PASSWORD, "/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      await page.getByRole("button", { name: "ساخت شمارش معکوس" }).click();
      await page.waitForTimeout(500);
      await page.locator("#title").fill("تایمر کوتاه");
      await page.locator('#create-countdown-form input:not([type="hidden"])').nth(2).fill("1");
      await page.getByRole("button", { name: /ساخت/ }).last().click();
      await page.waitForTimeout(2000);

      await page.goto("/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      await expect(page.getByText("تایمر کوتاه").first()).toBeVisible();
    });
  });

  test.describe("Edit countdown", () => {
    test("should edit a countdown title", async ({ page }) => {
      const email = getSuiteEmail("countdown6");
      await registerUserAndNavigate(page, "تست شمارش", email, TEST_PASSWORD, "/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      // Create a countdown first
      await page.getByRole("button", { name: "ساخت شمارش معکوس" }).click();
      await page.waitForTimeout(500);
      await page.locator("#title").fill("قابل ویرایش");
      await page.locator('#create-countdown-form input:not([type="hidden"])').nth(2).fill("5");
      await page.getByRole("button", { name: /ساخت/ }).last().click();
      await page.waitForTimeout(2000);

      await page.goto("/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      // Open the context menu (MoreVerticalIcon)
      const moreBtn = page.locator('button[title="مشاهده بیشتر"]').first();
      await moreBtn.waitFor({ state: "visible", timeout: 5000 });
      await moreBtn.click();
      await page.waitForTimeout(500);

      // Click edit button
      await page.getByRole("button", { name: "ویرایش" }).first().click();
      await page.waitForTimeout(500);

      // Edit the title
      const titleInput = page.locator("#title");
      await titleInput.clear();
      await titleInput.fill("ویرایش شده");
      await page.getByRole("button", { name: "ویرایش" }).last().click();
      await page.waitForTimeout(2000);

      await page.goto("/app/countdown");
      await page.waitForLoadState("domcontentloaded");
      await expect(page.getByText("ویرایش شده").first()).toBeVisible();
    });
  });

  test.describe("Delete countdown", () => {
    test("should delete a countdown", async ({ page }) => {
      const email = getSuiteEmail("countdown7");
      await registerUserAndNavigate(page, "تست شمارش", email, TEST_PASSWORD, "/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      // Create a countdown first
      await page.getByRole("button", { name: "ساخت شمارش معکوس" }).click();
      await page.waitForTimeout(500);
      await page.locator("#title").fill("برای حذف");
      await page.locator('#create-countdown-form input:not([type="hidden"])').nth(2).fill("2");
      await page.getByRole("button", { name: /ساخت/ }).last().click();
      await page.waitForTimeout(2000);

      await page.goto("/app/countdown");
      await page.waitForLoadState("domcontentloaded");

      // Open the context menu
      const moreBtn = page.locator('button[title="مشاهده بیشتر"]').first();
      await moreBtn.waitFor({ state: "visible", timeout: 5000 });
      await moreBtn.click();
      await page.waitForTimeout(500);

      // Click delete button
      await page.getByRole("button", { name: "حذف" }).click();
      await page.waitForTimeout(500);

      // Confirm in the alert dialog
      await page.getByRole("button", { name: "تایید" }).click();
      await page.waitForTimeout(2000);

      await page.goto("/app/countdown");
      await page.waitForLoadState("domcontentloaded");
      await expect(page.getByText("هیچ شمارش معکوسی وجود ندارد")).toBeVisible();
    });
  });
});
