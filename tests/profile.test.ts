import { expect, test } from '@playwright/test';

test('testLogOutButtonRedirectsToLogin', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('#menu-item-profile').click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(
    page.getByRole('heading', { name: 'Log in to your account' }),
  ).toBeVisible();
});

test('testLogOutButtonLogsOut', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('#menu-item-profile').click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.goto('/events.html');
  await page.locator('#menu-item-profile').click();
  await expect(page.getByRole('heading', { name: 'Ken Wu' })).not.toBeVisible();
});
