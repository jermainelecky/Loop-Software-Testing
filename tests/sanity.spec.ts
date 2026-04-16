import { test, expect } from '@playwright/test';
import { scenarios } from './data/scenario.types';
import { expectTagsForTask, expectTaskInColumn } from './helpers/board';
import { login } from './helpers/login';
import { openApplication } from './helpers/navigation';

test('demo app responds', async ({ page }) => {
  const scenario = scenarios[3];
  const response = await login(page);
  expect(response?.ok()).toBeTruthy();
  await openApplication(page, scenario.application);
  await expectTaskInColumn(page, scenario.taskTitle, scenario.column);
  await expectTagsForTask(page, scenario.taskTitle, scenario.tags);
});
