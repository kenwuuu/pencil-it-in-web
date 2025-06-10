import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } }); // run without cookies
test('testCreateAccountPageRedirectsToLoginPage', async ({ page }) => {
  await page.goto('/src/auth/create-account.html');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(
    page.getByRole('heading', { name: 'Log in to your account' }),
  ).toBeVisible();
});
