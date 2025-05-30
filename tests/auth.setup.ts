import { test } from "@playwright/test";
import { getCredentials } from "./credentialUtil";

const { EMAIL, PASSWORD } = getCredentials();

test("Login and save auth state", async ({ page }) => {
  await page.goto("/src/auth/login.html");

  await page.getByRole("textbox", { name: "Email address" }).fill(EMAIL);
  await page.getByRole("textbox", { name: "Password" }).fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForURL("**/events.html", { timeout: 15000 });

  await page.context().storageState({ path: "tests/playwright.auth.json" });
});
