import { test, expect } from '@playwright/test';

test('demo app responds', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
});
