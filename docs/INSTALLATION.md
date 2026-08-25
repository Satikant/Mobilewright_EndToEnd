# Installation and first run

Official install: https://mobilewright.dev/docs

## 1. Node project (already done in this repo)

```bash
npm install mobilewright @mobilewright/test
# or from this clone:
npm install
```

Optional scaffold (skip if `mobilewright.config.ts` exists):

```bash
npm init mobilewright@latest
```

## 2. Device toolchain

```bash
npx mobilewright doctor
npx mobilewright doctor --category android
npx mobilewright doctor --category ios
npx mobilewright devices
```

Fix everything `doctor` reports (Android SDK / Xcode / mobilecli / booted emulator).

## 3. App binary

- Android: APK path in `ANDROID_APP` (default `./apps/Androidapps.apk`)
- iOS: IPA/ZIP path in `IOS_APP`
- `BUNDLE_ID` must match the installed app

## 4. Config you must edit

`.env`:

- `ANDROID_DEVICE_NAME` — substring of `npx mobilewright devices` (this repo defaults to `Pixel 9 Pro XL`)
- `PROJECTS=android` until iOS is ready
- `RETRIES=0` locally, CI sets retries via `CI=true` or `RETRIES=2`

## 5. Confirm locators

```bash
npx mobilewright inspect
```

Replace fragile `getByText` with `getByTestId` when the app team can add ids.

## 6. First green test

```bash
npm run test:smoke -- --project=android
npx mobilewright show-report
```

If the USB-debug dialog is gone on your build, `handleUsbDebuggingIfPresent` already no-ops when the copy is missing.
