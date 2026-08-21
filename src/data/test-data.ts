import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface UserCredentials {
  validuserName: string;
  validpassWord: string;
  invaliduserName: string;
  invalidpassWord: string;
}

export function loadUsers(): UserCredentials {
  const path = resolve(process.cwd(), 'testdata/users.json');
  return JSON.parse(readFileSync(path, 'utf8')) as UserCredentials;
}
