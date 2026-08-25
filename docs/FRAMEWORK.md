# Framework design

Mobilewright is Playwright for mobile. The runner, fixtures, retries, reporters, and locators are the engine. This repo is the **test architecture** around that engine.

## Layers (do not skip)

```text
tests/*.spec.ts          orchestration only (Given/When/Then in code)
        │
src/fixtures             inject logger, db, pages (like a Java BaseTest)
        │
src/pages                locators + user actions (encapsulation)
        │
src/utils, src/db        retry/files/SQL (no locators)
        │
@mobilewright/test       screen / device / expect
```

A spec must not call `screen.getByText` except for a one-line assertion. Put flows on a page class.

## OOP mapping from Appium Java

### Encapsulation

Locators are `private` fields on the page. Tests never see `getByLabel('Username')`.

### Inheritance

`LoginPage extends BasePage`. `BasePage` owns swipe, back, expectVisible, screenshot.

### Polymorphism

`LoginContract` is the interface. Today `LoginPage` implements it. Tomorrow `IosLoginPage` can implement the same methods with different locators; `PageManager` returns `LoginContract`, so specs do not change.

### Abstraction

`DatabaseClient` hides JSON vs MySQL vs Postgres. Pages never import `mysql2`.

### Composition (prefer this over a tall class tree)

`PageManager` holds login + logout (and later home, settings). Dialogs (USB debug) stay methods or small component classes, not a 15-level hierarchy.

## Fixtures vs TestNG `@BeforeMethod`

```ts
export const test = base.extend({
  pages: async ({ screen, device, logger }, use) => {
    await use(new PageManager(screen, device, logger));
  },
});
```

Each test that lists `{ pages, db, logger }` gets a fresh page manager. `device` is worker-scoped (one device per worker). `screen` is test-scoped and owns failure video/screenshot.

## Retries (three levels — use the top one first)

1. **Auto-wait** — `tap()` / `toBeVisible()` poll (~100ms) until `actionTimeout` / `expect.timeout`.
2. **Test retries** — `retries` in config. On retry Mobilewright reconnects and relaunches the app on the **same** device.
3. **`withRetry()`** — only for DB/API/file I/O.

Serial describes retry as a **group** (`test.describe.configure({ mode: 'serial' })`).

## Parallelism and grouping

- `workers: N` requires N devices. Never set workers higher than connected devices.
- `fullyParallel: true` sends each test to its own worker. Leave it false while login tests share one app session.
- Per file: `test.describe.configure({ mode: 'parallel' | 'serial' })`.
- Tags in the title (`@smoke`, `@android-only`) plus `grep` / `grepInvert` on projects.
- `--project=android` selects the matrix row.
- `--shard=1/3` for CI machines; merge with blob reports (see Mobilewright sharding docs).

## Logging

`Logger` writes one JSON line per event to `logs/YYYY-MM-DD.log` and to stdout. `attachScreenshot` / `attachText` also land in the HTML report.

Set `DEBUG=mw:*` when you need Mobilewright driver traces.

## Data

| Store | When |
| --- | --- |
| `testdata/users.json` | static credentials |
| JSON `DatabaseClient` | seed/read without a real DB |
| MySQL / Postgres adapters | assert backend state, create users for the run |

Global setup seeds a health-check user so a missing DB fails **before** devices boot.

## Locator policy

Priority from the Inspector: `getByTestId` > `getByRole` > `getByLabel` > `getByText`.

Use `getByRole` for cross-platform tests. Use `getByType` only for widgets with no role (Spinner, RadioButton, DatePicker).

## What not to copy from Appium

- Explicit `Thread.sleep` / `WebDriverWait` loops — Mobilewright auto-waits.
- DesiredCapabilities classes — `mobilewright.config.ts` `use` / `projects`.
- Singleton Drivers — the `device` fixture is the session.
- Huge TestNG XML suites — tags + projects + npm scripts.
