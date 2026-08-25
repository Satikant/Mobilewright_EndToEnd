import { rootLogger } from './src/logging/logger.ts';

export default async function globalTeardown(): Promise<void> {
  rootLogger.info('global teardown complete');
}
