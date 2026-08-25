declare module 'mysql2/promise' {
  export function createPool(url: string): {
    query: (sql: string, params?: unknown[]) => Promise<[Record<string, unknown>[], unknown]>;
    end: () => Promise<void>;
  };
}

declare module 'pg' {
  export class Client {
    constructor(config: { connectionString: string });
    connect(): Promise<void>;
    query(
      sql: string,
      params?: unknown[],
    ): Promise<{ rows: Record<string, unknown>[]; rowCount: number | null }>;
    end(): Promise<void>;
  }
}
