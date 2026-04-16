# Implementation Method: Playwright Data-Driven Demo App Tests

This document breaks the technical evaluation into **small, sequential steps**. Complete each step before moving to the next; you can check items off as you go.

---

## Phase 0 — Understand the deliverable

1. **Re-read the acceptance criteria** and confirm you will:
   - Use **JavaScript or TypeScript only** (no other languages for tests).
   - Build a **Playwright** test suite.
   - Drive scenarios from a **JSON** structure so adding cases does not duplicate test code.
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

12. **Created `tests/data/scenarios.json`** as the source of truth for the six acceptance cases, with exact values for application area, task title, expected column, and expected tags.

13. **Added `tests/data/scenario.types.ts`** with TypeScript types/interfaces (`TestScenario`, `ScenarioFile`, and related union types) so the JSON shape is documented and consumed in a type-safe way.

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

23. **Write one parameterized test** (or one `test.describe` with `for`/`test` over the JSON array) that:
    - Loads the scenarios from JSON.
    - For each scenario: logs in (or uses authenticated fixture), navigates, asserts column + tags.

24. **Ensure adding test case 7** later is only **adding one JSON object**, not a new copy-pasted test block.

25. **Run the full suite** headless and headed; fix flakiness (waits, `expect` retries, locator strictness).

---

## Phase 7 — Quality and handoff

26. **Document in README** (only if appropriate for your submission): how to install, run tests, and where scenario data lives.

27. **Optional:** Add **lint/format** (ESLint, Prettier) and a **CI** workflow that runs `npx playwright test`—only if the evaluation expects it or you want a stronger impression.

28. **Final pass:** Confirm all six acceptance scenarios pass, credentials are not hardcoded in multiple files (use constants or env), and the JSON is the single source of truth for case variations.

---

## Suggested order of work (summary)

| Step | Focus |
|------|--------|
| 0–2 | Setup, Playwright install, config |
| 3 | JSON scenarios + shape |
| 4 | Login once, reuse everywhere |
| 5 | Nav + column + tag helpers |
| 6 | One data-driven test loop |
| 7 | Docs, polish, CI optional |

---

## Quick reference — evaluation constants

| Item | Value |
|------|--------|
| Demo URL | `https://animated-gingersnap-8cf7f2.netlify.app/` |
| Email | `admin` |
| Password | `password123` |

Use this file as a checklist: finish **Phase 0**, then **Phase 1**, and proceed in order unless a later phase blocks you (e.g. you may stub JSON in Phase 3 before Phase 4 if you prefer).

