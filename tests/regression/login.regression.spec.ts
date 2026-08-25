import { test, expect } from '../../src/fixtures/index.ts';

test.describe('login @regression @android-only', () => {
  test('rejects invalid credentials', async ({ pages, users, logger, screen }) => {
    await pages.login.handleUsbDebuggingIfPresent();
    await pages.login.selectTenant();
    await pages.login.chooseMobileEmail();
    await pages.login.login(users.invaliduserName, users.invalidpassWord);
    await logger.attachScreenshot(screen, 'invalid-login');
    await expect(screen.getByText(/invalid|incorrect|failed/i)).toBeVisible();
  });
});
