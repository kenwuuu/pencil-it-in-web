import { expect, test } from '@playwright/test';

test('testEndTimeUpdatesWhenStartTimeChanges', async ({ page }) => {
  await page.goto('/events.html');

  await page.locator('[data-testid="create-event-button"]:visible').click();

  const startTimeInput = page.locator('input[name="start_time"]');
  const endTimeInput = page.locator('input[name="end_time"]');

  // Set a known start time
  const testStartTime = '2025-06-22T15:00';
  await startTimeInput.fill(testStartTime);

  // Small wait for reactive update
  await page.waitForTimeout(100); // optional, could be replaced with waiting for endTime change

  const endTimeValue = await endTimeInput.inputValue();

  expect(endTimeValue).toBe('2025-06-22T16:00');
});
