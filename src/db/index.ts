import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isCloudSqlConfigured = () => {
  return Boolean(process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME);
};

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST || '127.0.0.1',
      user: process.env.SQL_USER || 'postgres',
      password: process.env.SQL_PASSWORD || '',
      database: process.env.SQL_DB_NAME || 'postgres',
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.warn('PostgreSQL pool event:', err.message);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
