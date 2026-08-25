import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import type { DatabaseClient, QueryResult, TestUser } from './database.interface.ts';

interface JsonDbShape {
  users: TestUser[];
}

export class JsonDatabase implements DatabaseClient {
  readonly kind = 'json' as const;
  private data: JsonDbShape = { users: [] };

  constructor(private readonly filePath: string) {}

  async connect(): Promise<void> {
    try {
      this.data = JSON.parse(readFileSync(this.filePath, 'utf8')) as JsonDbShape;
    } catch {
      this.data = { users: [] };
      this.flush();
    }
  }

  async disconnect(): Promise<void> {
    this.flush();
  }

  async query(sql: string, params: unknown[] = []): Promise<QueryResult> {
    const [command, table] = sql.trim().split(/\s+/);
    if (command?.toUpperCase() === 'SELECT' && table?.toLowerCase() === 'users') {
      const username = String(params[0] ?? '');
      const rows = this.data.users.filter((user) => !username || user.username === username);
      return { rows: rows as unknown as Record<string, unknown>[], rowCount: rows.length };
    }
    throw new Error(`JsonDatabase supports SELECT users queries only. Received: ${sql}`);
  }

  async getUser(username: string): Promise<TestUser | undefined> {
    return this.data.users.find((user) => user.username === username);
  }

  async seedUser(user: TestUser): Promise<void> {
    const index = this.data.users.findIndex((row) => row.username === user.username);
    if (index >= 0) this.data.users[index] = user;
    else this.data.users.push(user);
    this.flush();
  }

  private flush(): void {
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, `${JSON.stringify(this.data, null, 2)}\n`);
  }
}
