import type { DatabaseClient, QueryResult, TestUser } from './database.interface.ts';

/**
 * MySQL adapter. `mysql2` is loaded lazily so the framework installs cleanly
 * without native DB drivers until you need them:
 *   npm install mysql2
 */
export class MysqlDatabase implements DatabaseClient {
  readonly kind = 'mysql' as const;
  private pool: {
    query: (sql: string, params?: unknown[]) => Promise<[Record<string, unknown>[], unknown]>;
    end: () => Promise<void>;
  } | null = null;

  constructor(private readonly url: string) {}

  async connect(): Promise<void> {
    let mysql: typeof import('mysql2/promise');
    try {
      mysql = await import('mysql2/promise');
    } catch {
      throw new Error('DB_TYPE=mysql requires the mysql2 package. Run: npm install mysql2');
    }
    this.pool = mysql.createPool(this.url);
  }

  async disconnect(): Promise<void> {
    await this.pool?.end();
    this.pool = null;
  }

  async query(sql: string, params: unknown[] = []): Promise<QueryResult> {
    if (!this.pool) throw new Error('MySQL client is not connected');
    const [rows] = await this.pool.query(sql, params);
    const list = Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [];
    return { rows: list, rowCount: list.length };
  }

  async getUser(username: string): Promise<TestUser | undefined> {
    const result = await this.query(
      'SELECT username, password, role, tenant, active FROM users WHERE username = ? LIMIT 1',
      [username],
    );
    return result.rows[0] as unknown as TestUser | undefined;
  }

  async seedUser(user: TestUser): Promise<void> {
    await this.query(
      `INSERT INTO users (username, password, role, tenant, active)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role),
         tenant = VALUES(tenant), active = VALUES(active)`,
      [user.username, user.password, user.role ?? null, user.tenant ?? null, user.active ?? true],
    );
  }
}
