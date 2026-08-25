import { test, expect } from '../../src/fixtures/index.ts';

test.describe('login @smoke @android-only', () => {
  test.describe.configure({ mode: 'serial' });

  test('handles USB consent, tenant, and signs in with valid credentials', async ({
    pages,
    users,
    db,
    logger,
    screen,
  }, testInfo) => {
    logger.info('retry index', { retry: testInfo.retry });

    const seeded = await db.getUser(users.validuserName);
    const username = seeded?.username ?? users.validuserName;
    const password = seeded?.password ?? users.validpassWord;

    await pages.login.handleUsbDebuggingIfPresent();
    await pages.login.selectTenant(seeded?.tenant ?? 'Evelyn');
    await pages.login.chooseMobileEmail();
    await pages.login.login(username, password);
    await logger.attachScreenshot(screen, 'after-login');
  });
});
