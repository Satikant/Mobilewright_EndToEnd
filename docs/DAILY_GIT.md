# Daily git habit

Ship **one vertical slice per day** (a page, a spec, or a config fix) — not a giant uncommitted workspace. This repo is `Satikant/Mobilewright_EndToEnd`.

## First-time clone

```bash
git clone https://github.com/Satikant/Mobilewright_EndToEnd.git
cd Mobilewright_EndToEnd
git checkout -b feat/login-smoke
npm install
cp .env.example .env
```

Never commit `.env`, APKs, `test-results/`, `playwright-report/`, or `logs/`.

## Every working day

1. **Start from latest main**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/short-topic
   ```

2. **Implement only that topic** (example: Home page object + one smoke test).

3. **Prove it**

   ```bash
   npm run test:unit
   npm run lint:types
   npx mobilewright test tests/smoke --project=android
   ```

4. **Commit with a sentence that a teammate can grep**

   ```bash
   git add -A
   git status
   git commit -m "Add HomePage and @smoke open-home test"
   git push -u origin HEAD
   ```

5. **Open a pull request** on GitHub. Keep PRs smaller than a full app rewrite.

## If you must checkpoint unfinished work

```bash
git add -A
git commit -m "WIP: tenant picker locators (inspect next)"
git push
```

Next morning: rebase or merge main, then finish the WIP and rewrite the message if needed (`git commit --amend` only before anyone else uses the branch).

## Suggested 8-day build-out (one commit theme each day)

| Day | Commit theme |
| --- | --- |
| 1 | Env + doctor + smoke login on one device |
| 2 | Replace login locators using Inspector / testIDs |
| 3 | Next page object + PageManager wiring |
| 4 | JSON DB assertions in a regression spec |
| 5 | Tags (`@smoke` / `@regression`) and npm scripts only |
| 6 | Enable `WORKERS=2` on two emulators |
| 7 | JUnit artifact upload on a device runner |
| 8 | iOS project + shared `LoginContract` |

Do not wait until “the framework is done” to push. The structure in `src/` is the framework; product tests are added daily on top.
