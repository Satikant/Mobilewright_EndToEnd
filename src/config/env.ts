import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';

loadDotenv({ path: resolve(process.cwd(), '.env') });

export type Platform = 'ios' | 'android';
export type DbType = 'json' | 'mysql' | 'postgres';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function read(name: string, fallback = ''): string {
  return process.env[name]?.trim() || fallback;
}

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name]?.toLowerCase();
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  return fallback;
}

const platform = (read('PLATFORM', 'android') as Platform) === 'ios' ? 'ios' : 'android';

function parseProjects(): Array<'android' | 'ios'> {
  const raw = read('PROJECTS', platform);
  const names = raw
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter((name): name is 'android' | 'ios' => name === 'android' || name === 'ios');
  return names.length ? names : ['android'];
}

export const env = {
  ci: readBoolean('CI', false),
  platform,
  projects: parseProjects(),
  bundleId: read('BUNDLE_ID'),
  androidApp: read('ANDROID_APP', './apps/Androidapps.apk'),
  iosApp: read('IOS_APP', './apps/MyApp.zip'),
  androidDeviceName: read('ANDROID_DEVICE_NAME', 'Pixel 9 Pro XL'),
  iosDeviceName: read('IOS_DEVICE_NAME', 'iPhone 16'),
  deviceType: read('DEVICE_TYPE') as 'simulator' | 'emulator' | 'real' | '',
  osVersion: read('OS_VERSION') || undefined,
  testTimeout: readNumber('TEST_TIMEOUT', 120_000),
  actionTimeout: readNumber('ACTION_TIMEOUT', 8_000),
  expectTimeout: readNumber('EXPECT_TIMEOUT', 8_000),
  appLaunchTimeout: readNumber('APP_LAUNCH_TIMEOUT', 30_000),
  workers: readNumber('WORKERS', envWorkersDefault()),
  fullyParallel: readBoolean('FULLY_PARALLEL', false),
  retries: readNumber('RETRIES', process.env.CI ? 2 : 0),
  dbType: (read('DB_TYPE', 'json') as DbType) || 'json',
  dbJsonPath: read('DB_JSON_PATH', './testdata/db.json'),
  mysqlUrl: read('MYSQL_URL'),
  postgresUrl: read('POSTGRES_URL'),
  logLevel: (read('LOG_LEVEL', 'info') as LogLevel) || 'info',
  logDir: read('LOG_DIR', './logs'),
  mobilenextApiKey: read('MOBILENEXT_API_KEY'),
};

function envWorkersDefault(): number {
  return process.env.CI ? 2 : 1;
}

export function deviceNamePattern(platformName: Platform): RegExp {
  const name = platformName === 'ios' ? env.iosDeviceName : env.androidDeviceName;
  return new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}
