import { expect, test } from '@playwright/test';

test('testFriendsContainerIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('[data-testid="friends-menu-item"]:visible').click();
  await expect(
    page.getByText(/Friends within \d{1,3}(,\d{3})* miles? of you/),
  ).toBeVisible();
});

test('testFriendsListIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('[data-testid="friends-menu-item"]:visible').click();
  await expect(page.getByRole('heading', { name: 'Friends' })).toBeVisible();
});

test('testFriendsSearchBarIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('[data-testid="friends-menu-item"]:visible').click();
  await expect(
    page.locator('header').filter({ hasText: 'Friends' }).getByRole('textbox'),
  ).toBeVisible();
});

test('testFriendProfilePictureIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('[data-testid="friends-menu-item"]:visible').click();
  await expect(page.locator('.list-row > div').first()).toBeVisible();
});

test('testFriendsSearchButtonIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('[data-testid="friends-menu-item"]:visible').click();
  await expect(page.getByRole('button', { name: 'Add Friend' })).toBeVisible();
});
