import { test, expect } from '@playwright/test';
import { login } from './helpers/login';

test('demo app responds', async ({ page }) => {
  const response = await login(page);
  expect(response?.ok()).toBeTruthy();
});
