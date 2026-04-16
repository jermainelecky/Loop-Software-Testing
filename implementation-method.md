# Implementation Method: Playwright Data-Driven Demo App Tests

This document breaks the technical evaluation into **small, sequential steps**. Complete each step before moving to the next; you can check items off as you go.

---

## Phase 0 — Understand the deliverable

1. **Re-read the acceptance criteria** and confirm you will:
   - Use **JavaScript or TypeScript only** (no other languages for tests).
   - Build a **Playwright** test suite.
   - Drive tasks from a **JSON** structure so adding cases does not duplicate test code.
   - Automate **login** to the demo app with the provided URL and credentials.
   - Cover **six test cases** (board navigation, column placement, and tag assertions).

2. **Manually open the demo app** once in a browser: log in, click **Web Application** and **Mobile Application**, and note where task titles and tags appear (columns, labels). This reduces guesswork when writing selectors.

---

## Phase 1 — Project workspace

3. **Created a dedicated folder** for this task.

4. **Initialized the Node project** (`package.json`).

5. **Added a `.gitignore`** that ignores `node_modules`, Playwright artifacts (`test-results`, `playwright-report`, `.cache`), and local env files.

---

## Phase 2 — Install and configure Playwright

6. **Installed `@playwright/test`** as a dev dependency. TypeScript was already set up (`typescript`, `@types/node`), and **`@playwright/test`** supplies the test runner and TypeScript support for specs—no separate runner package.

7. **Ran `npx playwright install`** so Playwright downloaded its browser binaries (Chromium, Firefox, WebKit, ffmpeg, etc.) into the local Playwright cache. *Note: `playwright.config.ts` is set to run tests on **Chromium** only; but the other browsers are available.*

8. **Added `playwright.config.ts`** at the repo root with:
   - **`testDir`:** `./tests`
   - **`use.baseURL`:** `https://animated-gingersnap-8cf7f2.netlify.app/` (so `page.goto('/')` resolves to the demo app)
   - **Defaults:** HTML reporter, `trace: 'on-first-retry'`, CI-oriented `retries` / `workers` when `CI` is set
   - **Projects:** one project, **Desktop Chrome** (Chromium)

9. **Wired npm scripts** in `package.json`: `test` → `playwright test`, `test:ui` → `playwright test --ui`, `test:headed` → `playwright test --headed` (plus existing `typecheck`).

10. **Updated `tsconfig.json`** so `"types"` includes `"@playwright/test"` for type-checking specs.

---

## Phase 3 — Data model (JSON-driven design)

11. **Defined a single JSON schema** for all six test cases so each scenario can be driven from data instead of hardcoded test logic.
    - Included: **application**, **taskTitle**, **column**, and **tags**.
    - Kept a stable **id** per scenario (`TC1`-`TC6`) to make each case easy to reference in test output.

12. **Created `tests/data/tasks.json`** as the source of truth for the six acceptance cases, with exact values for application area, task title, expected column, and expected tags.

13. **Added `tests/data/tasks.types.ts`** with TypeScript types/interfaces (`TestTask`, `TaskFile`, and related union types) so the JSON shape is documented and consumed in a type-safe way.

---

## Phase 4 — Login automation (reusable)

14. **Implemented a reusable `login` helper** in `tests/helpers/login.ts` and routed test setup through that single entry point instead of duplicating auth steps in each spec.

15. **Loaded credentials from `.env`** and automated the login form flow:
    - Navigated to the demo app URL.
    - Filled `#username` and `#password`.
    - Submitted the form.

16. **Added explicit login-failure detection** by checking for the form error text (`Invalid username or password`) after submit and throwing an error if it appears, so credential problems fail tests immediately.

17. **Validated the helper in isolation** via the current sanity test path and confirmed it passes with `npm test` and `npm run typecheck`.

---

## Phase 5 — Navigation and assertions (page knowledge)

18. **Implemented reusable application-tab navigation** in `tests/helpers/navigation.ts` via `openApplication(page, application)`, using role-based lookup in `<nav>` and selecting the button that matches the scenario's application name.

19. **Added post-navigation validation** by asserting the page `<h1>` matches the selected application, confirming the tab switch actually succeeded.

20. **Implemented task-to-column verification** in `tests/helpers/board.ts` via `expectTaskInColumn(page, taskTitle, column)`, locating the task `<h3>`, walking to its column container, and asserting the column `<h2>` text matches the expected scenario column.

21. **Implemented strict tag verification** in `tests/helpers/board.ts` via `expectTagsForTask(page, taskTitle, tags)`, collecting tag text from the task's dedicated tag container `<span>` elements and asserting all expected tags are present.

22. **Refactored shared UI checks into helpers** (`openApplication`, `expectTaskInColumn`, `expectTagsForTask`) and wired them into the current test flow so test bodies remain concise and scenario-driven.

---

## Phase 6 — Data-driven tests (single loop, minimal duplication)

23. **Implemented a parameterized test suite** in `tests/sanity.spec.ts` using `test.describe` + a `for` loop over the `tasks` array from JSON.
    - Each generated test case runs the same shared flow: login, application navigation, task-in-column assertion, and tag assertion.

24. **Confirmed extensibility** by keeping all case-specific inputs in `tests/data/tasks.json`; adding a new case requires adding one new JSON object only (no duplicated test logic).

25. **Validated the full suite** with `npm run typecheck` and `npm test`; all six data-driven cases passed in Chromium.

---

## Phase 7 — Quality and handoff

26. **Documented the project in `README.md`** with clear setup and execution guidance:
    - How to install dependencies and Playwright browsers.
    - How to configure `.env` credentials.
    - How to run tests (`npm test`, headed mode, and UI mode).
    - Where task data and task types live (`tests/data/tasks.json`, `tests/data/tasks.types.ts`).

27. **Completed a final validation pass** by running `npm run typecheck` and `npm test`, confirming all six acceptance tasks passed.

28. **Confirmed configuration quality at handoff**:
    - Credentials are consumed from env variables in the login helper (not hardcoded across tests).
    - JSON task data remains the single source of truth for test-case variations.

---

## Order of work (summary)

| Step | Focus |
|------|--------|
| 0–2 | Setup, Playwright install, config |
| 3 | JSON tasks + shape |
| 4 | Login once, reuse everywhere |
| 5 | Nav + column + tag helpers |
| 6 | One data-driven test loop |
| 7 | Polish and document |

---

## Quick reference — evaluation constants

| Item | Value |
|------|--------|
| Demo URL | `https://animated-gingersnap-8cf7f2.netlify.app/` |
| Email | `admin` |
| Password | `password123` |
