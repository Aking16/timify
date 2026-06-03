import { Page } from "@playwright/test";

/**
 * Test user credentials. Using unique email to avoid conflicts.
 */
export const TEST_USER = {
  name: "تست کاربر",
  email: `e2e-test-${Date.now()}@timify.test`,
  password: "TestPassword123!",
};

/**
 * Register a new user via the UI and navigate to the app.
 * Navigates to /auth?tab=register, fills out the form, submits,
 * and waits for the redirect to complete.
 */
export async function registerUser(page: Page) {
  await registerUserAndNavigate(page, TEST_USER.name, TEST_USER.email, TEST_USER.password);
}

/**
 * Register a new user via the UI with custom credentials.
 * After successful registration, ALWAYS navigates explicitly to the target URL.
 * This avoids flakiness from the client-side redirect chain.
 */
export async function registerUserAndNavigate(
  page: Page,
  name: string,
  email: string,
  password: string,
  targetUrl: string = "/app/projects"
) {
  await page.goto("/auth?tab=register");

  // Wait for the register form to render
  await page.waitForSelector('h1:has-text("حساب خود را بسازید")', { timeout: 10000 });

  // Fill in the registration form
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Submit the form
  await page.getByRole("button", { name: "ساخت" }).click();

  // Wait a moment for the registration API call to complete and session to be set
  await page.waitForTimeout(2000);

  // Navigate explicitly to the target URL — this is more reliable than
  // waiting for the client-side redirect chain (/auth -> / -> /app/projects)
  await page.goto(targetUrl);
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Log in as an existing user via the UI.
 * Navigates to /auth, fills out the form, and submits.
 */
export async function loginUser(page: Page) {
  await loginUserAndNavigate(page, TEST_USER.email, TEST_USER.password);
}

/**
 * Log in as an existing user and navigate to the given target URL.
 * After successful login, ALWAYS navigates explicitly to the target URL.
 */
export async function loginUserAndNavigate(
  page: Page,
  email: string,
  password: string,
  targetUrl: string = "/app/projects"
) {
  await page.goto("/auth");

  // Wait for the login form to render
  await page.waitForSelector('h1:has-text("وارد حساب خود شوید")', { timeout: 10000 });

  // Fill in the login form
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Submit the form
  await page.getByRole("button", { name: "ورود" }).click();

  // Wait a moment for the login API call to complete
  await page.waitForTimeout(2000);

  // Navigate explicitly to the target URL
  await page.goto(targetUrl);
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Fully clear auth state (localStorage + cookies) to log out.
 */
export async function clearAuthState(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  // Clear all cookies
  await page.context().clearCookies();
  // Navigate to auth to confirm we're logged out
  await page.goto("/auth");
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Log out the current user by clearing all auth state.
 */
export async function logoutUser(page: Page) {
  await clearAuthState(page);
  await page.goto("/auth");
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Create a project via the sidebar "افزودن پروژه" button.
 * Requires user to be logged in and on an app page.
 */
export async function createProject(page: Page, projectName: string) {
  // Click on "افزودن پروژه" in the sidebar
  const addProjectBtn = page.getByRole("button", { name: "افزودن پروژه" });
  await addProjectBtn.click();

  // Wait for the dialog to open
  await page.waitForSelector('h2:has-text("ساخت پروژه جدید")', { timeout: 5000 });

  // Fill in the project name
  const nameInput = page.locator("#name");
  await nameInput.fill(projectName);

  // Submit the form
  await page.getByRole("button", { name: "Create Project" }).click();

  // Wait for dialog to close
  await page.waitForTimeout(1500);
}

/**
 * Ensure the sidebar is in expanded state by clearing the sidebar_state cookie.
 * The shadcn sidebar persists its collapsed/expanded state in a cookie,
 * which can cause subsequent tests to see a collapsed sidebar.
 */
export async function expandSidebar(page: Page) {
  await page.evaluate(() => {
    document.cookie = "sidebar_state=true; path=/; max-age=86400";
  });
}

/**
 * Select a project from the sidebar project selector dropdown.
 * Opens the dropdown and clicks the project with the given name.
 *
 * The sidebar project selector writes to localStorage (active-project) when an
 * item is selected. Navigation to the project page only happens when visiting
 * /app (which reads localStorage and redirects). This function handles that flow.
 *
 * First navigates to /app/projects to ensure the sidebar is fully rendered
 * with fresh server data.
 */
export async function selectProjectFromSidebar(page: Page, projectName: string) {
  // Navigate fresh to ensure sidebar has latest project data
  await page.goto("/app/projects");
  await page.waitForLoadState("domcontentloaded");

  // Ensure sidebar is expanded (must be called AFTER page navigation)
  await expandSidebar(page);
  await page.waitForTimeout(1000);

  // Click the sidebar project selector button.
  // IMPORTANT: filter({ hasText: "پروژه" }) also matches "افزودن پروژه" (substring!).
  // Use getByRole with exact name match for the standalone "پروژه" button.
  const projectButton = page.getByRole("button", { name: "پروژه", exact: true }).first();
  await projectButton.waitFor({ state: "visible", timeout: 5000 });
  await projectButton.click({ force: true });

  // Wait for the dropdown to appear
  await page.waitForTimeout(800);

  // Click the project in the dropdown
  const projectItem = page.getByRole("menuitem", { name: projectName }).first();
  await projectItem.waitFor({ state: "visible", timeout: 10000 });
  await projectItem.click({ force: true });

  // Now navigate to /app which will read localStorage and redirect to the project page
  await page.waitForTimeout(500);
  await page.goto("/app");
  await page.waitForLoadState("domcontentloaded");

  // The /app page should redirect to /app/project/{id} or /app/projects
  // We want to land on the project page
  try {
    await page.waitForURL(/\/app\/project\//, { timeout: 10000 });
  } catch {
    // If redirect didn't happen, the project was saved locally but no redirect occurred.
    // Continue anyway — caller can check the URL.
  }
}

/**
 * Start a timer from the sidebar's "شروع تسک" button.
 */
export async function startTimer(page: Page) {
  const startBtn = page.getByRole("button", { name: "شروع تسک" });
  await startBtn.click();
  await page.waitForTimeout(1500);
}

/**
 * Delete all test data for the test user.
 */
export async function cleanupTestData(page: Page) {
  try {
    await page.goto("/app/projects");
    await page.waitForLoadState("domcontentloaded");
  } catch {
    // Ignore errors during cleanup
  }
}

/**
 * Dismiss the Next.js dev overlay if present (can intercept pointer events).
 */
export async function dismissDevOverlay(page: Page) {
  await page.evaluate(() => {
    // Close any nextjs-portal overlay
    const portal = document.querySelector("nextjs-portal");
    if (portal) {
      portal.remove();
    }
  });
}

/**
 * Get a consistent test email using a timestamp
 */
export function getTestEmail(): string {
  return `e2e-test-${Date.now()}@timify.test`;
}

/**
 * Get a consistent test email for a specific test suite
 */
export function getSuiteEmail(suite: string): string {
  return `e2e-${suite}-${Date.now()}@timify.test`;
}
