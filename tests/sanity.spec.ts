import { test, expect } from '@playwright/test';
import { tasks } from './data/tasks.types';
import { expectTagsForTask, expectTaskInColumn } from './helpers/board';
import { login } from './helpers/login';
import { openApplication } from './helpers/navigation';

test('demo app responds', async ({ page }) => {
  const task = tasks[3];
  const response = await login(page);
  expect(response?.ok()).toBeTruthy();
  await openApplication(page, task.application);
  await expectTaskInColumn(page, task.taskTitle, task.column);
  await expectTagsForTask(page, task.taskTitle, task.tags);
});

