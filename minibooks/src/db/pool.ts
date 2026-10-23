import { Pool } from "pg";

/** PostgreSQL connection pool used for the startup health check and shutdown. */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});
