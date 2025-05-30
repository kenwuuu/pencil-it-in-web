import { expect, test } from "@playwright/test";

test("testFriendProfilePictureIsVisible", async ({ page }) => {
  await page.goto("/events.html");
  await page.getByTestId("friends-menu-item").click();
  await expect(page.locator(".profile-photo").first()).toBeVisible();
});
