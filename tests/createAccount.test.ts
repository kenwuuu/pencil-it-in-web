import { expect, test } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const TESTING_EMAIL = process.env.TESTING_EMAIL || '';
const TESTING_PASSWORD = process.env.TESTING_PASSWORD || '';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const profilePhotoPath = 'black-pfp-for-tests.jpg';

if (TESTING_EMAIL === '') {
  throw new Error(
    'TESTING_EMAIL environment variable is not set. Please add it to your .env file in project root or to your environment configuration.',
  );
}

if (TESTING_PASSWORD === '') {
  throw new Error(
    'TESTING_PASSWORD environment variable is not set. Please add it to your .env file in project root or to your environment configuration.',
  );
}

test.use({ storageState: { cookies: [], origins: [] } }); // run without cookies
test('testCreateAccountPageRedirectsToLoginPage', async ({ page }) => {
  await page.goto('/src/auth/create-account.html');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(
    page.getByRole('heading', { name: 'Log in to your account' }),
  ).toBeVisible();
});

// todo this currently passes even if the user already exists. we need to check for duplicate accounts on the frontend
// and prevent signups
test('testCreateAccount', async ({ page }) => {
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
    .fill(TESTING_EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Atwf3@vaw');
  const imagePath = path.resolve(__dirname, profilePhotoPath);
  await page.locator('input[type="file"]').setInputFiles(imagePath);
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page.getByText('Please check your email for')).toBeVisible();
});

test('testPhotoUploadWorks', async ({ page }) => {
  await page.goto('/src/auth/create-account.html');
  await page
    .getByRole('button', { name: 'Create Account' })
    .scrollIntoViewIfNeeded();
  const imagePath = path.resolve(__dirname, profilePhotoPath);
  await page.locator('input[type="file"]').setInputFiles(imagePath);

  await expect(page.getByText(profilePhotoPath)).toBeVisible();
});
