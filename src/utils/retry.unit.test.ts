import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { withRetry } from './retry.ts';

describe('withRetry', () => {
  it('returns on first success', async () => {
    const value = await withRetry(async () => 42, { attempts: 3 });
    assert.equal(value, 42);
  });

  it('retries until success', async () => {
    let calls = 0;
    const value = await withRetry(
      async () => {
        calls += 1;
        if (calls < 3) throw new Error('not yet');
        return 'ok';
      },
      { attempts: 5, delayMs: 1 },
    );
    assert.equal(value, 'ok');
    assert.equal(calls, 3);
  });

  it('throws after exhausting attempts', async () => {
    await assert.rejects(
      () =>
        withRetry(
          async () => {
            throw new Error('always');
          },
          { attempts: 2, delayMs: 1 },
        ),
      /always/,
    );
  });
});
