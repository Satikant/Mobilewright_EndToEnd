import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Device, Screen } from '@mobilewright/core';
import type { TestInfo } from '@playwright/test';

/** Manual screenshot in addition to the automatic failure screenshot. */
export async function captureStepScreenshot(
  screen: Screen,
  testInfo: TestInfo,
  stepName: string,
): Promise<Buffer> {
  const fileName = `${stepName.replace(/\s+/g, '-')}.png`;
  const path = testInfo.outputPath(fileName);
  const buffer = await screen.screenshot({ path });
  await testInfo.attach(stepName, { body: buffer, contentType: 'image/png' });
  return buffer;
}

/**
 * Mobilewright already records video on failure via the `screen` fixture.
 * Use this only when a passing test must keep a clip (debug a specific flow).
 */
export async function recordClip<T>(
  device: Device,
  testInfo: TestInfo,
  body: () => Promise<T>,
): Promise<T> {
  const output = testInfo.outputPath('clip.mp4');
  mkdirSync(join(output, '..'), { recursive: true });
  await device.startRecording({ output, timeLimit: 120 });
  try {
    return await body();
  } finally {
    const result = await device.stopRecording();
    const videoPath = result.output ?? output;
    await testInfo.attach('video-clip', { path: videoPath, contentType: 'video/mp4' });
  }
}
