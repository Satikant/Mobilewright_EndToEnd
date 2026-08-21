import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deviceNamePattern } from './env.ts';

describe('deviceNamePattern', () => {
  it('escapes regex metacharacters in the device name', () => {
    const pattern = deviceNamePattern('android');
    assert.equal(pattern.test('Pixel 9 Pro XL'), true);
    assert.equal(pattern.test('Pixel 99 Pro XL'), false);
  });
});
