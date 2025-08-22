import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import * as schema from './schema';

// Create database instance
let db: ReturnType<typeof drizzle> | ReturnType<typeof drizzleNeon>;

if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
  // Production (Vercel with Neon) - use serverless driver
  const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL!);
  db = drizzleNeon(sql, { schema });
} else {
  // Development - use node-postgres with connection pool
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'tonyism_db',
    user: process.env.DB_USER || process.env.USER,
    password: process.env.DB_PASSWORD || '',
  });
  db = drizzle(pool, { schema });
}

// Export db instance and schema
export { db };
export * from './schema';