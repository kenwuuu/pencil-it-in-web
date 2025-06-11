import { expect, test } from '@playwright/test';

test.afterAll('testLogOutButtonRedirectsToLogin', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('#menu-item-profile').click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(
    page.getByRole('heading', { name: 'Log in to your account' }),
  ).toBeVisible();
});
