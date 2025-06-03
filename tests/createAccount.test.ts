import {expect, test} from "@playwright/test";

test('testFirstNameFieldIsVisible', async ({page}) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', {name: 'Log In'}).click();
  await page.getByRole('link', {name: 'Create New Account'}).click();
  await expect(page.getByRole('textbox', {name: 'First name'})).toBeVisible();
});

test('testLastNameFieldIsVisible', async ({page}) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', {name: 'Log In'}).click();
  await page.getByRole('link', {name: 'Create New Account'}).click();
  await expect(page.getByRole('textbox', {name: 'Last name'})).toBeVisible();
});

test('testUsernameFieldIsVisible', async ({page}) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', {name: 'Log In'}).click();
  await page.getByRole('link', {name: 'Create New Account'}).click();
  await expect(page.getByRole('textbox', {name: 'Username'})).toBeVisible();
});

test('testEmailAddressFieldIsVisible', async ({page}) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', {name: 'Log In'}).click();
  await page.getByRole('link', {name: 'Create New Account'}).click();
  await expect(page.getByRole('textbox', {name: 'Email address'})).toBeVisible();
});

test('testPasswordFieldIsVisible', async ({page}) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', {name: 'Log In'}).click();
  await page.getByRole('link', {name: 'Create New Account'}).click();
  await expect(page.getByRole('textbox', {name: 'Password'})).toBeVisible();
});

test('testLogInButtonRedirectsToLoginPage', async ({page}) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', {name: 'Log In'}).click();
  await page.getByRole('link', {name: 'Create New Account'}).click();
  await page.getByRole('link', {name: 'Login'}).click();
  await expect(page.getByRole('button', {name: 'Log in'})).toBeVisible();
});
