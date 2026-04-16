# Loop Software Testing

Playwright + TypeScript technical evaluation using a data-driven JSON source for task cases.

## Prerequisites

- Node.js 18+ (or current LTS)
- npm

## Install

1. Install project dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Create a root `.env` file with login credentials:

```env
APP_USERNAME=admin
APP_PASSWORD=password123
```

## Run Tests

- Run all tests (headless):

```bash
npm test
```

- Run in headed mode (see browser actions):

```bash
npm run test:headed
```

- Run with Playwright UI:

```bash
npm run test:ui
```

- Type-check TypeScript:

```bash
npm run typecheck
```

## Task Data Location

- Task data source: `tests/data/tasks.json`
- Type definitions for task data: `tests/data/tasks.types.ts`

Each test case is represented as a JSON object in `tasks.json` and includes:

- `id`
- `application`
- `taskTitle`
- `column`
- `tags`

## Implementation Notes

If you want to see how the test suite was built step-by-step, refer to [implementation-method.md`](/implementation-method.md).