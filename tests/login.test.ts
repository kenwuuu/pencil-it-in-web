import { expect, test } from "@playwright/test";

test("testLoginRedirectsToEventsPage", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Log In" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("kenqiwu@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("adsihn9");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.locator("#navbar-logo")).toContainText("pencil it in");
  await expect(page.locator("events-container")).toContainText("Events");
});

test("testCreateAccountButtonRedirectsToCreateAccountPage", async ({
                                                                     page
                                                                   }) => {
  await page.goto("/src/auth/login.html#");
  await page.getByRole("link", { name: "Create New Account" }).click();
  await expect(page.getByRole("heading")).toContainText("Create an account");
});

test("testForgotPasswordButtonRedirectsToPasswordResetPage", async ({
                                                                      page
                                                                    }) => {
  await page.goto("/src/auth/login.html#");
  await page.getByRole("link", { name: "Forgot password?" }).click();

  // todo add password reset page and then remove this skip
  await test.step.skip("not yet ready", async () => {
    await expect(page.getByRole("heading")).toContainText(
      "Reset your password"
    );
  });
});
