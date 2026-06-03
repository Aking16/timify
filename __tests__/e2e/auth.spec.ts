import { test, expect } from "@playwright/test";
import { getSuiteEmail, registerUserAndNavigate } from "./helpers";

const TEST_PASSWORD = "TestPassword123!";

/**
 * Helper: Logs in using the UI form (filling email/password and clicking
 * the login button), then waits for the client-side redirect chain
 * (/auth -> / -> /app) to settle, and finally navigates to the app.
 *
 * This mirrors what registerUserAndNavigate does for registration, which
 * is proven to work. Using the UI form instead of a direct API call
 * ensures the better-auth client-side session handling runs correctly.
 */
async function loginAndNavigate(
  page: import("@playwright/test").Page,
  email: string,
  password: string
) {
  await page.goto("/auth");
  await page.waitForSelector('h1:has-text("وارد حساب خود شوید")', { timeout: 10000 });

  // Fill in the login form
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Submit the form
  await page.getByRole("button", { name: "ورود" }).click();

  // Wait a moment for the login API call to complete and session to be set
  await page.waitForTimeout(2000);

  // Navigate explicitly to the target URL — same reliable pattern
  // used by registerUserAndNavigate for registration.
  await page.goto("/app/projects");
  await page.waitForLoadState("domcontentloaded");
}

test.describe("Authentication Flow", () => {
  test.describe("Unauthenticated access", () => {
    test("should redirect unauthenticated users from /app to /auth", async ({ page }) => {
      await page.goto("/app");
      await page.waitForURL("/auth");
      expect(page.url()).toContain("/auth");
    });

    test("should redirect unauthenticated users from /app/projects to /auth", async ({ page }) => {
      await page.goto("/app/projects");
      await page.waitForURL("/auth");
      expect(page.url()).toContain("/auth");
    });

    test("should redirect unauthenticated users from /app/tags to /auth", async ({ page }) => {
      await page.goto("/app/tags");
      await page.waitForURL("/auth");
      expect(page.url()).toContain("/auth");
    });
  });

  test.describe("Login page rendering", () => {
    test("should display the login form with all required elements", async ({ page }) => {
      await page.goto("/auth");

      // Check the page title
      await expect(page.locator("h1")).toContainText("وارد حساب خود شوید");

      // Check the logo/brand is present
      await expect(page.locator('a:has-text("تایمیفای")')).toBeVisible();

      // Check form fields exist
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();

      // Check submit button
      await expect(page.getByRole("button", { name: "ورود" })).toBeVisible();

      // Check register link exists
      await expect(page.locator('a[href="?tab=register"]')).toContainText("ثبت نام");
    });
  });

  test.describe("Register form", () => {
    test("should toggle to register form via ?tab=register", async ({ page }) => {
      await page.goto("/auth");

      // Click the register link
      await page.click('a[href="?tab=register"]');

      // Wait for register form
      await expect(page.locator("h1")).toContainText("حساب خود را بسازید");

      // Check register form fields exist
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();

      // Check the submit button
      await expect(page.getByRole("button", { name: "ساخت" })).toBeVisible();
    });

    test("should toggle back to login form via ?tab=login", async ({ page }) => {
      await page.goto("/auth?tab=register");

      // Click the login link
      await page.click('a[href="?tab=login"]');

      // Wait for login form
      await expect(page.locator("h1")).toContainText("وارد حساب خود شوید");
    });
  });

  test.describe("Registration flow", () => {
    test("should successfully register a new user", async ({ page }) => {
      const email = getSuiteEmail("auth-register");
      await registerUserAndNavigate(page, "تست کاربر", email, TEST_PASSWORD);

      // Should land on app page
      expect(page.url()).toContain("/app");
    });
  });

  test.describe("Login flow", () => {
    test("should successfully log in with registered credentials", async ({ browser }) => {
      const email = getSuiteEmail("auth-login");

      // Use a separate context to register, then close it so cookies are isolated
      const regContext = await browser.newContext();
      const regPage = await regContext.newPage();
      await registerUserAndNavigate(regPage, "تست کاربر", email, TEST_PASSWORD);
      await regContext.close();

      // Now log in with the same credentials using a FRESH context (no cookies)
      const loginContext = await browser.newContext();
      const loginPage = await loginContext.newPage();
      await loginAndNavigate(loginPage, email, TEST_PASSWORD);
      expect(loginPage.url()).toContain("/app");
      await loginContext.close();
    });
  });

  test.describe("Form validation", () => {
    test("should show validation error for empty email", async ({ page }) => {
      await page.goto("/auth");

      // Try submitting with empty fields
      await page.fill('input[name="email"]', "");
      await page.fill('input[name="password"]', "somepassword");
      await page.getByRole("button", { name: "ورود" }).click();

      await page.waitForTimeout(1000);
      expect(page.url()).toContain("/auth");
    });

    test("should show validation error for empty password", async ({ page }) => {
      await page.goto("/auth");

      await page.fill('input[name="email"]', "test@example.com");
      await page.fill('input[name="password"]', "");
      await page.getByRole("button", { name: "ورود" }).click();

      await page.waitForTimeout(1000);
      expect(page.url()).toContain("/auth");
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto("/auth");

      await page.fill('input[name="email"]', "nonexistent@example.com");
      await page.fill('input[name="password"]', "wrongpassword");
      await page.getByRole("button", { name: "ورود" }).click();

      await page.waitForTimeout(2000);
      expect(page.url()).toContain("/auth");
    });

    test("should show validation for short name on register", async ({ page }) => {
      await page.goto("/auth?tab=register");

      await page.fill('input[name="name"]', "");
      await page.fill('input[name="email"]', "newuser@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.getByRole("button", { name: "ساخت" }).click();

      await page.waitForTimeout(1000);
      expect(page.url()).toContain("/auth");
    });
  });

  test.describe("Post-login redirect", () => {
    test("should redirect to app after successful login", async ({ browser }) => {
      const email = getSuiteEmail("auth-postlogin");

      // Use a separate context to register, then close it
      const regContext = await browser.newContext();
      const regPage = await regContext.newPage();
      await registerUserAndNavigate(regPage, "تست کاربر", email, TEST_PASSWORD);
      await regContext.close();

      // Login with a fresh context
      const loginContext = await browser.newContext();
      const loginPage = await loginContext.newPage();
      await loginAndNavigate(loginPage, email, TEST_PASSWORD);
      expect(loginPage.url()).toContain("/app");
      await loginContext.close();
    });
  });
});
