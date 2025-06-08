import { expect, test } from '@playwright/test';

test('testFriendsContainerIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.getByTestId('friends-menu-item').click();
  await expect(page.getByText('Friends within 30 miles of you')).toBeVisible();
});

test('testFriendsListIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.getByTestId('friends-menu-item').click();
  await expect(page.getByRole('heading', { name: 'Friends' })).toBeVisible();
});

test('testFriendsSearchBarIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.getByTestId('friends-menu-item').click();
  await expect(
    page
      .locator('header')
      .filter({ hasText: 'Friends Add Friend' })
      .locator('div')
      .nth(1),
  ).toBeVisible();
});

test('testFriendProfilePictureIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.getByTestId('friends-menu-item').click();
  await expect(page.locator('.list-row > div').first()).toBeVisible();
});

test('testFriendsSearchButtonIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.getByTestId('friends-menu-item').click();
  await expect(page.getByRole('button', { name: 'Add Friend' })).toBeVisible();
});
