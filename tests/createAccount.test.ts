import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } }); // run without cookies
test('testCreateAccountPageRedirectsToLoginPage', async ({ page }) => {
  await page.goto('/src/auth/create-account.html');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(
    page.getByRole('heading', { name: 'Log in to your account' }),
  ).toBeVisible();
});

// todo fix this test to upload photo correctly and then remove the `.skip` to re-enable the test
test.use({ storageState: { cookies: [], origins: [] } }); // run without cookies
test.skip('testCreateAccount', async ({ page }) => {
  await page.goto('/src/auth/create-account.html');
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('e2eTest');
  await page.getByRole('textbox', { name: 'First name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Last name' }).fill('e2eTest');
  await page.getByRole('textbox', { name: 'Last name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Username' }).fill('e2e_test');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page
    .getByRole('button', { name: 'Create Account' })
    .scrollIntoViewIfNeeded();
  await page
    .getByRole('textbox', { name: 'Email address' })
    .fill('matria972@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Atwf3@vaw');
  await page.locator('input[type="file"]').setInputFiles('IMG_6436.jpeg');

  await expect(page.getByText('Please check your email for a')).toBeVisible();
});
