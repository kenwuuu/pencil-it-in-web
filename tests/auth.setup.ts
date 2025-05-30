import { test } from '@playwright/test';
import { getCredentials } from './credentialUtil';

const { EMAIL, PASSWORD } = getCredentials();

test('Login and save auth state', async ({ page }) => {
  try {
    await page.goto('/src/auth/login.html');
  } catch (err) {
    throw new Error(
      'Could not connect to the server. Make sure your local server is running and accessible at the expected URL.'
    );
  }

  await page.getByRole('textbox', { name: 'Email address' }).fill(EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForURL('**/events.html', { timeout: 15000 });

  await page.context().storageState({ path: 'tests/playwright.auth.json' });
});
