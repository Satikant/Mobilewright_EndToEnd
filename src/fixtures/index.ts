import { test as base, expect } from '@mobilewright/test';
import type { DatabaseClient } from '../db/database.interface.ts';
import { createDatabase } from '../db/factory.ts';
import { loadUsers, type UserCredentials } from '../data/test-data.ts';
import { Logger } from '../logging/logger.ts';
import { PageManager } from '../pages/page-manager.ts';

type FrameworkFixtures = {
  logger: Logger;
  db: DatabaseClient;
  users: UserCredentials;
  pages: PageManager;
};

/**
 * Extended test: every spec gets logger, db, testdata, and page objects
 * without repeating setup. This is the TypeScript equivalent of a Java
 * BaseTest + dependency injection.
 */
export const test = base.extend<FrameworkFixtures>({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger('test', testInfo);
    logger.info('test started', { file: testInfo.file, retry: testInfo.retry });
    await use(logger);
    logger.info('test finished', { status: testInfo.status });
  },

  db: async ({ logger }, use, testInfo) => {
    const db = createDatabase();
    await db.connect();
    logger.info('database connected', { kind: db.kind });
    if (testInfo.retry) {
      logger.warn('retry attempt — refresh seeded data if the previous run left dirty state');
    }
    await use(db);
    await db.disconnect();
  },

  users: async ({}, use) => {
    await use(loadUsers());
  },

  pages: async ({ screen, device, logger }, use) => {
    await use(new PageManager(screen, device, logger));
  },
});

export { expect };
