import { test } from '../../src/fixtures/index.ts';

/**
 * Example of grouping + serial mode: later tests reuse app state from earlier ones.
 * The whole describe retries together if any step fails.
 */
test.describe('authenticated flow @serial', () => {
  test.describe.configure({ mode: 'serial', retries: 1 });

  test('sign in', async ({ pages, users }) => {
    await pages.login.handleUsbDebuggingIfPresent();
    await pages.login.selectTenant();
    await pages.login.chooseMobileEmail();
    await pages.login.login(users.validuserName, users.validpassWord);
  });

  test('sign out', async ({ pages }) => {
    await pages.logout.logout();
  });
});
