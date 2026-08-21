import { android, defineConfig } from 'mobilewright';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  platform: 'android',
  bundleId: '',
  deviceName:/Pixel 9 Pro XL/,
  installApps: './apps/Androidapps.apk',
  timeout:120_000,
});
