import { chromium } from "@playwright/test";
import { EMAIL, PASSWORD } from "../constants";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // log in
  await page.goto("http://localhost:5173/src/auth/login.html");
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill(EMAIL);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  // Wait for navigation or some indicator of successful login
  await page.waitForURL("**/events");

  // Save auth state
  await page.context().storageState({ path: "playwright.auth.json" });
  await browser.close();
})();
