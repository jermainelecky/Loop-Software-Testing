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

3. **Create or use a dedicated folder** for this task (e.g. this repo root or a subfolder like `playwright-demo-app`).

4. **Initialize a Node project** (`package.json`) if one does not exist yet.

5. **Add a `.gitignore`** that ignores `node_modules`, Playwright artifacts (`test-results`, `playwright-report`, `.cache`), and local env files if you introduce any.

---

## Phase 2 — Install and configure Playwright

6. **Install Playwright** and the test runner for your chosen language:
   - TypeScript: `@playwright/test`, `typescript`, and types as needed.
   - Or JavaScript only: `@playwright/test` without TypeScript.

7. **Run the Playwright install step** for browsers (e.g. `npx playwright install` or the command the initializer prints).

8. **Add `playwright.config.ts` or `playwright.config.js`** with:
   - Base URL set to `https://animated-gingersnap-8cf7f2.netlify.app/` (or use full URLs in tests—pick one approach and stay consistent).
   - Sensible defaults: timeout, screenshot/trace on failure if you want them for debugging.
   - A **test directory** (e.g. `tests/`).

9. **Add npm scripts** in `package.json` such as `test`, `test:ui`, and `test:headed` for local runs.

---

## Phase 3 — Data model (JSON-driven design)

10. **Define a single JSON structure** that can express every scenario without repeating logic. For each case, include at least:
    - **application** (e.g. `"Web Application"` | `"Mobile Application"`).
    - **taskTitle** (exact string to find on the board).
    - **column** (e.g. `"To Do"` | `"In Progress"` | `"Done"`).
    - **tags** (array of expected tag strings, in the order or set you will assert).

11. **Create a data file** (e.g. `tests/data/scenarios.json` or `tests/fixtures/scenarios.json`) containing **six objects** matching the six test cases from the evaluation (titles, columns, and tags exactly as specified).

12. **Optional but useful:** Add a **TypeScript interface** or JSDoc typedef for a scenario so the JSON shape stays documented and type-safe.

---

## Phase 4 — Login automation (reusable)

13. **Implement a login helper** used by all tests:
    - Navigate to the demo app URL.
    - Fill **email** with `admin` and **password** with `password123`.
    - Submit the form and **wait until the post-login UI is ready** (URL change, dashboard element, or network idle—whatever is stable).

14. **Extract login into one place**: a function in a `helpers/` or `fixtures/` file, or a **Playwright fixture** that performs login before each test that needs it. Avoid copying the same login steps into every test file.

15. **Run the helper in isolation** (temporary test or `test.only`) to confirm login succeeds every time.

---

## Phase 5 — Navigation and assertions (page knowledge)

16. **Implement navigation to an application tab**: after login, click **Web Application** or **Mobile Application** based on scenario data. Use **role**, **text**, or **data-testid** selectors—prefer the most stable option the app exposes.

17. **Implement “task in column” verification**:
    - Locate the column by name (e.g. **To Do**, **In Progress**, **Done**).
    - Within that column, assert the **task title** is visible.

18. **Implement tag verification**:
    - For each expected tag in the scenario JSON, assert it appears **on or near** the correct task (same card/row as the title). Adjust if the UI groups tags differently.

19. **Refactor duplicated UI steps** into shared functions (e.g. `openApplication(name)`, `expectTaskInColumn(task, column)`, `expectTagsForTask(task, tags)`) so the **test file only loops data + calls helpers**.

---

## Phase 6 — Data-driven tests (single loop, minimal duplication)

20. **Write one parameterized test** (or one `test.describe` with `for`/`test` over the JSON array) that:
    - Loads the scenarios from JSON.
    - For each scenario: logs in (or uses authenticated fixture), navigates, asserts column + tags.

21. **Ensure adding test case 7** later is only **adding one JSON object**, not a new copy-pasted test block.

22. **Run the full suite** headless and headed; fix flakiness (waits, `expect` retries, locator strictness).

---

## Phase 7 — Quality and handoff

23. **Document in README** (only if appropriate for your submission): how to install, run tests, and where scenario data lives.

24. **Optional:** Add **lint/format** (ESLint, Prettier) and a **CI** workflow that runs `npx playwright test`—only if the evaluation expects it or you want a stronger impression.

25. **Final pass:** Confirm all six acceptance scenarios pass, credentials are not hardcoded in multiple files (use constants or env), and the JSON is the single source of truth for case variations.

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
