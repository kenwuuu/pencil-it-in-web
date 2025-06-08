import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } }); // run without cookies
test('testNo404WithoutCookies', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('404')).not.toBeVisible();
});

test('testNo404WithCookies', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('404')).not.toBeVisible();
});
