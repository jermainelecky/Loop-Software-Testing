import { test, expect } from '@playwright/test';
import { tasks } from './data/tasks.types';
import { expectTagsForTask, expectTaskInColumn } from './helpers/board';
import { login } from './helpers/login';
import { openApplication } from './helpers/navigation';

test.describe('Demo app task validation', () => {
  for (const task of tasks) {
    test(`${task.id}: ${task.taskTitle}`, async ({ page }) => {
      const response = await login(page);
      expect(response?.ok()).toBeTruthy();
      await openApplication(page, task.application);
      await expectTaskInColumn(page, task.taskTitle, task.column);
      await expectTagsForTask(page, task.taskTitle, task.tags);
    });
  }
});

