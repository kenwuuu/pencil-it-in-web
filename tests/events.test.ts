import { expect, test } from '@playwright/test';
import fs from 'fs/promises';

test('testEventsContainerIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
});

test('testCalendarExportButtonIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await expect(page.locator('.download-calendar-btn').first()).toBeVisible();
});

test('testCalendarExportButtonStartsDownload', async ({ page }) => {
  await page.goto('/events.html');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('.download-calendar-btn').first().click();
  const download = await downloadPromise;
  const downloadPath = await download.path();

  if (downloadPath) {
    const fileBuffer = await fs.readFile(downloadPath);
    // assert file size to be greater than 300 char
    expect(fileBuffer.length).toBeGreaterThan(300);

    // assert certain hardcoded strings exist
    const content = fileBuffer.toString('utf-8');
    expect(content).toContain('BEGIN:VEVENT');
    expect(content).toContain('PencilItIn/Calendar');

    // Delete the file
    await fs.unlink(downloadPath);
  } else {
    throw new Error(
      'Download path is null — are you running headless without trace/output?',
    );
  }
});

test('testEventCreationComponentIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Create Event' })
    .locator('a')
    .click();
  await expect(
    page.getByRole('heading', { name: 'Create New Event' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Create Event' }),
  ).toBeVisible();
});

test('testHostButtonIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await expect(page.getByText('Host:').first()).toBeVisible();
});

test('testNoButtonIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await expect(page.getByText('No:').first()).toBeVisible();
});

test('testMaybeButtonIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await expect(page.getByText('Maybe:').first()).toBeVisible();
});

test('testEventDetailModalOpens', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('.title-container').first().click();
  await expect(page.locator('event-details-modal div').nth(2)).toBeVisible();
});

test('testEventDetailModalCloses', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('.title-container').first().click();
  var modalOutside = (await page
    .locator('event-details-modal div')
    .nth(2)
    .boundingBox())!;
  await page.mouse.click(modalOutside.x + 1, modalOutside.y + 1);
  await expect(
    page.locator('event-details-modal div').nth(2),
  ).not.toBeVisible();
});

test('testEventDetailModalCloseButtonWorks', async ({ page }) => {
  await page.goto('/events.html');
  await page.locator('.title-container').first().click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(
    page.locator('event-details-modal div').nth(2),
  ).not.toBeVisible();
});

test('testDeleteEventButtonIsVisible', async ({ page }) => {
  await page.goto('/events.html');
  await page.getByText('Host: Ken').first().scrollIntoViewIfNeeded();
  const box = await page.getByText('Host: Ken').first().boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y - 10); // click 30 pixels above top edge of Host button, centered horizontally
  }
  await expect(
    page.getByRole('button', { name: 'Delete Event' }),
  ).toBeVisible();
});

// add tests that confirm delete button only appears for host after we set up mocks
