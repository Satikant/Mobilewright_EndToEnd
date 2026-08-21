import type { DatabaseClient, QueryResult, TestUser } from './database.interface.ts';

/**
 * Postgres adapter. Install when needed:
 *   npm install pg
 */
export class PostgresDatabase implements DatabaseClient {
  readonly kind = 'postgres' as const;
  private client: {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[]; rowCount: number | null }>;
    connect: () => Promise<void>;
    end: () => Promise<void>;
  } | null = null;

  constructor(private readonly url: string) {}

  async connect(): Promise<void> {
    let pg: typeof import('pg');
    try {
      pg = await import('pg');
    } catch {
      throw new Error('DB_TYPE=postgres requires the pg package. Run: npm install pg');
    }
    this.client = new pg.Client({ connectionString: this.url });
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client?.end();
    this.client = null;
  }

  async query(sql: string, params: unknown[] = []): Promise<QueryResult> {
    if (!this.client) throw new Error('Postgres client is not connected');
    const result = await this.client.query(sql, params);
    return { rows: result.rows, rowCount: result.rowCount ?? result.rows.length };
  }

  async getUser(username: string): Promise<TestUser | undefined> {
    const result = await this.query(
      'SELECT username, password, role, tenant, active FROM users WHERE username = $1 LIMIT 1',
      [username],
    );
    return result.rows[0] as unknown as TestUser | undefined;
  }

  async seedUser(user: TestUser): Promise<void> {
    await this.query(
      `INSERT INTO users (username, password, role, tenant, active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO UPDATE SET
         password = EXCLUDED.password, role = EXCLUDED.role,
         tenant = EXCLUDED.tenant, active = EXCLUDED.active`,
      [user.username, user.password, user.role ?? null, user.tenant ?? null, user.active ?? true],
    );
  }
}
