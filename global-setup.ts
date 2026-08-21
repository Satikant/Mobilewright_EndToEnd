import { mkdirSync } from 'node:fs';
import { env } from './src/config/env.ts';
import { createDatabase } from './src/db/factory.ts';
import { rootLogger } from './src/logging/logger.ts';

export default async function globalSetup(): Promise<void> {
  mkdirSync(env.logDir, { recursive: true });
  rootLogger.info('global setup', {
    platform: env.platform,
    dbType: env.dbType,
    workers: env.workers,
    retries: env.retries,
    fullyParallel: env.fullyParallel,
  });

  const db = createDatabase();
  await db.connect();
  rootLogger.info('database reachable', { kind: db.kind });
  await db.disconnect();
}
