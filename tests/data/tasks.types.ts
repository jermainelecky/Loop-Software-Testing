import tasksJson from './tasks.json';

export type ApplicationName = 'Web Application' | 'Mobile Application';
export type ColumnName = 'To Do' | 'In Progress' | 'Done';
export type TagName = 'Feature' | 'High Priority' | 'Bug' | 'Design';

export interface TestTask {
  id: string;
  application: ApplicationName;
  taskTitle: string;
  column: ColumnName;
  tags: TagName[];
}

export interface TaskFile {
  tasks: TestTask[];
}

const typedTasksFile = tasksJson as TaskFile;

export const tasks = typedTasksFile.tasks;
