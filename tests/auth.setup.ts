import { test } from "@playwright/test";

const isCI = process.env.CI?.toUpperCase() === "TRUE" || process.env.CI === "1";

console.log("Running in CI mode: ", isCI);

const EMAIL = isCI ? process.env.PLAYWRIGHT_KEN_EMAIL : process.env.PENCIL_IT_IN_EMAIL;
const PASSWORD = isCI ? process.env.PLAYWRIGHT_KEN_PASSWORD : process.env.PENCIL_IT_IN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  throw new Error("Missing login credentials: EMAIL or PASSWORD env vars are not set.");
}

test("Login and save auth state", async ({ page }) => {
  await page.goto("/src/auth/login.html");

  await page.getByRole("textbox", { name: "Email address" }).fill(EMAIL);
  await page.getByRole("textbox", { name: "Password" }).fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForURL("**/events.html", { timeout: 15000 });

  await page.context().storageState({ path: "tests/playwright.auth.json" });
});
