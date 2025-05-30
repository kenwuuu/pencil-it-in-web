import { expect, test } from "@playwright/test";

test("testFriendsPageIsVisible", async ({ page }) => {
  await page.goto("/events");
  await page.getByTestId("friends-menu-item").click();
  await expect(page.locator(".profile-photo").first()).toBeVisible();
});
