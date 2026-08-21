import { defineConfig, type MobilewrightProjectConfig } from 'mobilewright';
import { deviceNamePattern, env } from './src/config/env.ts';

const projects: MobilewrightProjectConfig[] = [];

if (env.projects.includes('android')) {
  projects.push({
    name: 'android',
    grepInvert: /@ios-only/,
    use: {
      platform: 'android',
      bundleId: env.bundleId || undefined,
      deviceName: deviceNamePattern('android'),
      installApps: env.androidApp,
    },
  });
}

if (env.projects.includes('ios')) {
  projects.push({
    name: 'ios',
    grepInvert: /@android-only/,
    use: {
      platform: 'ios',
      bundleId: env.bundleId || undefined,
      deviceName: deviceNamePattern('ios'),
      installApps: env.iosApp,
    },
  });
}

/**
 * Runner config. Device/app settings live in projects so one suite can
 * target Android and iOS without duplicating tests.
 *
 * Built-in Mobilewright capabilities wired here:
 * - retries (flaky tests) — retries in CI, 0 locally unless RETRIES is set
 * - workers + fullyParallel — one worker == one device
 * - reporters — list + HTML + JUnit + JSON
 * - viewTree on failure — accessibility dump attached to the report
 * - screenshots + video — captured by the screen fixture on failure
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.{spec,test}.ts',
  outputDir: 'test-results',
  timeout: env.testTimeout,
  retries: env.retries,
  workers: env.workers,
  fullyParallel: env.fullyParallel,
  forbidOnly: env.ci,
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  reporter: env.ci
    ? [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [
        ['list'],
        ['html', { open: 'on-failure' }],
      ],
  viewTree: 'on-failure',
  captureGitInfo: { commit: true },
  use: {
    animations: 'off',
    actionTimeout: env.actionTimeout,
    appLaunchTimeout: env.appLaunchTimeout,
    installTimeout: 180_000,
  },
  expect: {
    timeout: env.expectTimeout,
  },
  projects,
});
