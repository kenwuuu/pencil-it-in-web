import { expect, test } from '@playwright/test';

test('testBugReportButtonVisibleOnEventsPage', async ({ page }) => {
  await page.goto('/events.html');
  await expect(page.locator('[icon="mdi:spider"]')).toBeVisible();
});

test('testBugReportButtonVisibleOnFriendsPage', async ({ page }) => {
  await page.goto('/events.html');
  await page.getByTestId('friends-menu-item').click();
  await expect(page.locator('[icon="mdi:spider"]')).toBeVisible();
});

test('testBugReportButtonVisibleOnProfilePage', async ({ page }) => {
  await page.goto('/events.html');
  await page.getByText('Profile').click();
  await expect(page.locator('[icon="mdi:spider"]')).toBeVisible();
});

test('testBugReportButtonRedirects', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('[icon="mdi:spider"]').click();
  await expect(
    page.getByRole('heading', { name: 'pencil it in - Bug/Feature' }),
  ).toBeVisible();
  await expect(
    page.locator('label').filter({ hasText: '🐛 Bug' }),
  ).toBeVisible();
  await page.locator('label').filter({ hasText: '🌟 Feature' }).click();
  await expect(
    page.locator('label').filter({ hasText: '🌟 Feature' }),
  ).toBeVisible();
});
