import { Page, Response } from '@playwright/test';
import 'dotenv/config';

export async function login(page: Page): Promise<Response | null> {
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;

  if (!username || !password) {
    throw new Error('Missing APP_USERNAME/APP_PASSWORD in .env file.');
  }

  const response = await page.goto('/');
  const form = page.locator('form');

  await form.locator('#username').fill(username);
  await form.locator('#password').fill(password);
  await form.locator('button[type="submit"]').click();

  const invalidCredentialsMessage = form.getByText('Invalid username or password', { exact: true });
  const loginFailed = await invalidCredentialsMessage
    .waitFor({ state: 'visible', timeout: 1500 })
    .then(() => true)
    .catch(() => false);

  if (loginFailed) {
    throw new Error('Login failed: Invalid username or password.');
  }

  return response;
}
