import { expect, Page } from '@playwright/test';
import { ColumnName, TagName } from '../data/tasks.types';

export async function expectTaskInColumn(
  page: Page,
  taskTitle: string,
  expectedColumn: ColumnName
): Promise<void> {
  const taskHeading = page.getByRole('heading', { level: 3, name: taskTitle, exact: true });
  await expect(taskHeading).toBeVisible();

  const taskColumn = taskHeading.locator('xpath=ancestor::*[.//h2][1]');
  const columnHeading = taskColumn.locator('h2').first();

  await expect(columnHeading).toContainText(expectedColumn);
}

export async function expectTagsForTask(
  page: Page,
  taskTitle: string,
  expectedTags: TagName[]
): Promise<void> {
  const taskHeading = page.getByRole('heading', { level: 3, name: taskTitle, exact: true });
  await expect(taskHeading).toBeVisible();

  const tagsContainer = taskHeading.locator('xpath=following-sibling::p[1]/following-sibling::div[1]');
  const tagSpans = tagsContainer.locator('span');
  const actualTags = (await tagSpans.allTextContents()).map((tag) => tag.trim());

  expectedTags.forEach((expectedTag) => {
    expect(actualTags).toContain(expectedTag);
  });
}

