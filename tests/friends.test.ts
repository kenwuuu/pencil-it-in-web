import { expect, test } from "@playwright/test";

// todo reactivate test after implementing API to fetch friends
test.skip("testFriendProfilePictureIsVisible", async ({ page }) => {
  await page.goto("/events.html");
  await page.getByTestId("friends-menu-item").click();
  await expect(page.locator(".profile-photo").first()).toBeVisible();
});
