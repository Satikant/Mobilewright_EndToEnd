/**
 * Database port. Tests depend on this interface (abstraction), not on MySQL/Postgres.
 * Swap implementations with DB_TYPE without changing page objects or specs.
 */
export interface QueryResult {
  rows: Record<string, unknown>[];
  rowCount: number;
}

export interface DatabaseClient {
  readonly kind: 'json' | 'mysql' | 'postgres';
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query(sql: string, params?: unknown[]): Promise<QueryResult>;
  getUser(username: string): Promise<TestUser | undefined>;
  seedUser(user: TestUser): Promise<void>;
}

export interface TestUser {
  username: string;
  password: string;
  role?: string;
  tenant?: string;
  active?: boolean;
}
