import { expect, Page } from '@playwright/test';
import { ApplicationName } from '../data/tasks.types';

export async function openApplication(page: Page, application: ApplicationName): Promise<void> {
  const nav = page.locator('nav');
  const applicationButton = nav.getByRole('button', { name: new RegExp(`^${application}\\b`) });

  await expect(applicationButton).toBeVisible();
  await applicationButton.click();
  await expect(page.getByRole('heading', { level: 1, name: application, exact: true })).toBeVisible();
}

