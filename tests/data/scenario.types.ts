import scenariosJson from './scenarios.json';

export type ApplicationName = 'Web Application' | 'Mobile Application';
export type ColumnName = 'To Do' | 'In Progress' | 'Done';
export type TagName = 'Feature' | 'High Priority' | 'Bug' | 'Design';

export interface TestScenario {
  id: string;
  application: ApplicationName;
  taskTitle: string;
  column: ColumnName;
  tags: TagName[];
}

export interface ScenarioFile {
  scenarios: TestScenario[];
}

const typedScenariosFile = scenariosJson as ScenarioFile;

export const scenarios = typedScenariosFile.scenarios;
