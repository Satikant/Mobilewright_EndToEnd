import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonDatabase } from './json.database.ts';

describe('JsonDatabase', () => {
  it('seeds and reads a user', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'mw-db-'));
    const db = new JsonDatabase(join(dir, 'db.json'));
    await db.connect();
    await db.seedUser({ username: 'alice', password: 'secret', role: 'qa' });
    const user = await db.getUser('alice');
    assert.equal(user?.password, 'secret');
    const queried = await db.query('SELECT users', ['alice']);
    assert.equal(queried.rowCount, 1);
    await db.disconnect();
    rmSync(dir, { recursive: true, force: true });
  });
});
