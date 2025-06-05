import { expect, test } from '@playwright/test';
import { getCredentials } from './credentialUtil';

const { EMAIL, PASSWORD } = getCredentials();

test('testLoginPageRedirectsToEventsPage', async ({ page }) => {
  await page.goto('/src/auth/login.html');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('pencil it in')).toBeVisible();
});

test('testCreateAccountButtonRedirectsToCreateAccountPage', async ({
  page,
}) => {
  await page.goto('/src/auth/login.html#');
  await page.getByRole('link', { name: 'Create New Account' }).click();
  await expect(page.getByRole('heading')).toContainText('Create an account');
});

test('testForgotPasswordButtonRedirectsToPasswordResetPage', async ({
  page,
}) => {
  await page.goto('/src/auth/login.html#');
  await page.getByRole('link', { name: 'Forgot password?' }).click();

  // todo add password reset page and then remove this skip
  await test.step.skip('not yet ready', async () => {
    await expect(page.getByRole('heading')).toContainText(
      'Reset your password',
    );
  });
});
