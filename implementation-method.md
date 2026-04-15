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

7. **Ran `npx playwright install`** so Playwright downloaded its browser binaries (Chromium, Firefox, WebKit, ffmpeg, etc.) into the local Playwright cache. *Note: `playwright.config.ts` is set to run tests on **Chromium** only; the other browsers are available if we add projects later.*

8. **Added `playwright.config.ts`** at the repo root with:
   - **`testDir`:** `./tests`
   - **`use.baseURL`:** `https://animated-gingersnap-8cf7f2.netlify.app/` (so `page.goto('/')` resolves to the demo app)
   - **Defaults:** HTML reporter, `trace: 'on-first-retry'`, CI-oriented `retries` / `workers` when `CI` is set
   - **Projects:** one project, **Desktop Chrome** (Chromium)

9. **Wired npm scripts** in `package.json`: `test` → `playwright test`, `test:ui` → `playwright test --ui`, `test:headed` → `playwright test --headed` (plus existing `typecheck`).

10. **Updated `tsconfig.json`** so `"types"` includes `"@playwright/test"` for type-checking specs.

11. **Added `tests/sanity.spec.ts`** as a smoke test (HTTP 200 on `/`) and removed the temporary `placeholder.ts` file.

---

## Phase 3 — Data model (JSON-driven design)

12. **Define a single JSON structure** that can express every scenario without repeating logic. For each case, include at least:
    - **application** (e.g. `"Web Application"` | `"Mobile Application"`).
    - **taskTitle** (exact string to find on the board).
    - **column** (e.g. `"To Do"` | `"In Progress"` | `"Done"`).
    - **tags** (array of expected tag strings, in the order or set you will assert).

13. **Create a data file** (e.g. `tests/data/scenarios.json` or `tests/fixtures/scenarios.json`) containing **six objects** matching the six test cases from the evaluation (titles, columns, and tags exactly as specified).

14. **Optional but useful:** Add a **TypeScript interface** or JSDoc typedef for a scenario so the JSON shape stays documented and type-safe.

---

## Phase 4 — Login automation (reusable)

15. **Implement a login helper** used by all tests:
    - Navigate to the demo app URL.
    - Fill **email** with `admin` and **password** with `password123`.
    - Submit the form and **wait until the post-login UI is ready** (URL change, dashboard element, or network idle—whatever is stable).

16. **Extract login into one place**: a function in a `helpers/` or `fixtures/` file, or a **Playwright fixture** that performs login before each test that needs it. Avoid copying the same login steps into every test file.

17. **Run the helper in isolation** (temporary test or `test.only`) to confirm login succeeds every time.

---

## Phase 5 — Navigation and assertions (page knowledge)

18. **Implement navigation to an application tab**: after login, click **Web Application** or **Mobile Application** based on scenario data. Use **role**, **text**, or **data-testid** selectors—prefer the most stable option the app exposes.

19. **Implement “task in column” verification**:
    - Locate the column by name (e.g. **To Do**, **In Progress**, **Done**).
    - Within that column, assert the **task title** is visible.

20. **Implement tag verification**:
    - For each expected tag in the scenario JSON, assert it appears **on or near** the correct task (same card/row as the title). Adjust if the UI groups tags differently.

21. **Refactor duplicated UI steps** into shared functions (e.g. `openApplication(name)`, `expectTaskInColumn(task, column)`, `expectTagsForTask(task, tags)`) so the **test file only loops data + calls helpers**.

---

## Phase 6 — Data-driven tests (single loop, minimal duplication)

22. **Write one parameterized test** (or one `test.describe` with `for`/`test` over the JSON array) that:
    - Loads the scenarios from JSON.
    - For each scenario: logs in (or uses authenticated fixture), navigates, asserts column + tags.

23. **Ensure adding test case 7** later is only **adding one JSON object**, not a new copy-pasted test block.

24. **Run the full suite** headless and headed; fix flakiness (waits, `expect` retries, locator strictness).

---

## Phase 7 — Quality and handoff

25. **Document in README** (only if appropriate for your submission): how to install, run tests, and where scenario data lives.

26. **Optional:** Add **lint/format** (ESLint, Prettier) and a **CI** workflow that runs `npx playwright test`—only if the evaluation expects it or you want a stronger impression.

27. **Final pass:** Confirm all six acceptance scenarios pass, credentials are not hardcoded in multiple files (use constants or env), and the JSON is the single source of truth for case variations.

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
