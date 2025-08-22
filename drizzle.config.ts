import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: (process.env.POSTGRES_URL || process.env.DATABASE_URL)
    ? {
        url: (process.env.POSTGRES_URL || process.env.DATABASE_URL)!,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'tonyism_db',
        user: process.env.DB_USER || process.env.USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
      },
} satisfies Config;