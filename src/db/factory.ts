import { env } from '../config/env.ts';
import type { DatabaseClient } from './database.interface.ts';
import { JsonDatabase } from './json.database.ts';
import { MysqlDatabase } from './mysql.database.ts';
import { PostgresDatabase } from './postgres.database.ts';

export function createDatabase(): DatabaseClient {
  switch (env.dbType) {
    case 'mysql':
      if (!env.mysqlUrl) throw new Error('MYSQL_URL is required when DB_TYPE=mysql');
      return new MysqlDatabase(env.mysqlUrl);
    case 'postgres':
      if (!env.postgresUrl) throw new Error('POSTGRES_URL is required when DB_TYPE=postgres');
      return new PostgresDatabase(env.postgresUrl);
    default:
      return new JsonDatabase(env.dbJsonPath);
  }
}
