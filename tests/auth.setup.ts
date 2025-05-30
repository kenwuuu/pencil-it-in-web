import { chromium } from "@playwright/test";

const isCI = process.env.CI === "true" || process.env.CI === "1" || process.env.CI === "TRUE" || process.env.CI === "TRUE";

const EMAIL = isCI ? process.env.PLAYWRIGHT_KEN_EMAIL : process.env.PENCIL_IT_IN_EMAIL;
const PASSWORD = isCI ? process.env.PLAYWRIGHT_KEN_PASSWORD : process.env.PENCIL_IT_IN_PASSWORD;
const BASE_URL = isCI ? process.env.BASE_URL : "http://localhost:5173/";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // log in
  await page.goto(`${BASE_URL}/src/auth/login.html`);
  await page.getByRole("textbox", { name: "Email address" }).fill(EMAIL || "");
  await page.getByRole("textbox", { name: "Password" }).fill(PASSWORD || "");
  await page.getByRole("button", { name: "Log in" }).click();

  // Wait for navigation or some indicator of successful login
  await page.waitForURL("**/events.html", { timeout: 2000 });

  // Save auth state
  await page.context().storageState({ path: "playwright.auth1.json" });
  await browser.close();
})();
