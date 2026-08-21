# Mobilewright End-to-End Framework

A TypeScript test framework on [Mobilewright](https://mobilewright.dev/docs) for iOS and Android. It follows the same OOP ideas you used in Appium/Java (page objects, a base class, interfaces, a manager facade) and adds logging, data stores, retries, artifacts, grouping, and parallel runs.

This repository started from a small `PageObjects` + one spec. That login flow is preserved under `src/pages` and `tests/smoke`.

## What Mobilewright already gives you

Do not rebuild these — they are built in:

| Need | Mobilewright feature |
| --- | --- |
| Auto-wait / no sleeps | Locator actions and `expect()` retry until timeout |
| Test retries | `retries` in config or `--retries` |
| Screenshots on failure | `screen` fixture |
| Video on failure | `screen` fixture |
| Accessibility dump on failure | `viewTree: 'on-failure'` |
| Parallel on many devices | `workers` + `fullyParallel: true` (one worker = one device) |
| Grouping | `test.describe`, tags, `--grep`, `--project` |
| HTML / JUnit / JSON reports | `reporter` |
| Cross-machine scale | `--shard=x/n` + blob reports |
| Device inspector | `npx mobilewright inspect` |

This framework adds the layer Java testers usually write themselves: pages, fixtures, env, logs, and databases.

## Repository layout

```text
apps/                         APK / IPA (gitignored; keep .gitkeep)
src/
  config/env.ts               .env → typed settings
  logging/logger.ts           JSON file + console + report attachments
  db/                         DatabaseClient + json | mysql | postgres
  data/test-data.ts           testdata/users.json loader
  pages/                      POM: BasePage, contracts, LoginPage, PageManager
  fixtures/index.ts           test.extend → logger, db, users, pages
  utils/retry.ts              extra retries for DB/API (not locators)
  utils/artifacts.ts          extra screenshot / video helpers
tests/
  smoke/                      @smoke
  regression/                 @regression
  e2e/                        serial multi-step flows (@serial)
testdata/                     users.json + json DB seed
mobilewright.config.ts        runner, projects, retries, reporters
global-setup.ts               once per run (DB seed, log dir)
docs/                         design + daily git habit
```

## Install (local machine)

Prereqs: Node 18+, a booted emulator/simulator or a real device, and [mobilecli](https://mobilewright.dev/docs) on PATH (`npx mobilewright doctor` will tell you what is missing).

```bash
git clone https://github.com/Satikant/Mobilewright_EndToEnd.git
cd Mobilewright_EndToEnd
npm install
cp .env.example .env
# edit .env: BUNDLE_ID, ANDROID_APP path, ANDROID_DEVICE_NAME
npx mobilewright doctor
npx mobilewright devices
npm test -- --project=android --grep @smoke
npx mobilewright show-report
```

Put the APK at `./apps/Androidapps.apk` (or change `ANDROID_APP`). Set `BUNDLE_ID` to the app id.

## Everyday commands

```bash
npm test                      # all enabled projects
npm run test:smoke            # --grep @smoke
npm run test:regression
npm run test:android
npm run test:list             # discover tests, do not run
npm run inspect               # locator inspector
npm run report
npm run test:unit             # logger/db helpers, no device
```

Parallel (needs as many devices as workers):

```bash
WORKERS=2 FULLY_PARALLEL=true npm test
```

Tags / grouping:

```bash
npx mobilewright test --grep @smoke
npx mobilewright test --grep-invert @serial
npx mobilewright test --project=android
```

## Java → TypeScript map

| Java (Appium) | This repo |
| --- | --- |
| `abstract class BasePage` | `src/pages/base.page.ts` |
| `interface LoginPage` | `src/pages/contracts/login.contract.ts` |
| `class AndroidLoginPage extends BasePage` | `LoginPage implements LoginContract` |
| private `By` locators | private `screen.getBy*` fields |
| `POManager` | `PageManager` |
| `BaseTest` + TestNG | `src/fixtures/index.ts` (`test.extend`) |
| TestNG groups | tags `@smoke` + `--grep` |
| TestNG retry analyzer | `retries` in `mobilewright.config.ts` |
| Extent / log4j | `Logger` + HTML report attachments |
| JDBC | `DatabaseClient` implementations |

Prefer **composition** (PageManager + fixtures) over deep inheritance. Add an `IosLoginPage` only when locators actually diverge; `getByRole` / `getByTestId` often stay shared.

## Databases

Default is a JSON file (`testdata/db.json`) so the suite runs without MySQL.

```bash
DB_TYPE=json
# later:
# npm install mysql2   && DB_TYPE=mysql    MYSQL_URL=mysql://...
# npm install pg       && DB_TYPE=postgres POSTGRES_URL=postgres://...
```

Specs call `db.getUser()` / `db.seedUser()` — never a vendor API. That is the same abstraction you would use with a Java DAO.

## Screenshots and video

- Failure screenshot and failure video: automatic (`screen` fixture).
- Accessibility tree on failure: `viewTree: 'on-failure'`.
- Extra step shot: `await logger.attachScreenshot(screen, 'after-login')`.
- Extra clip on a passing test: `recordClip(device, testInfo, async () => { ... })`.

## Next implementation steps

Work in this order so each day produces a small, commitable slice:

1. Finish `.env` + `npx mobilewright doctor` + confirm the smoke login against a real device.
2. Stabilize locators with `npx mobilewright inspect` (`getByTestId` > `getByRole` > `getByLabel` > `getByText`).
3. Add the next screens as classes under `src/pages`, expose them from `PageManager`.
4. Move hardcoded strings into `testdata/` and/or the JSON DB.
5. Split specs by `@smoke` / `@regression`; use `mode: 'serial'` only when tests share session state.
6. Raise `WORKERS` when you have two emulators; keep `FULLY_PARALLEL=false` while files are stateful.
7. Turn on the commented e2e job in `.github/workflows/mobilewright.yml` once a device runner exists.
8. Add iOS by setting `PROJECTS=android,ios` and an IPA path.

Read `docs/FRAMEWORK.md` for design rules and `docs/DAILY_GIT.md` for the daily commit/push loop.

## Docs used

- https://mobilewright.dev/docs
- https://github.com/mobile-next/mobilewright
