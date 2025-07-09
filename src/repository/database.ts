import { Pool } from 'pg';

export const pool: Pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    max: 20,
    password: String(process.env.DB_PASSWORD),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60,
    port: Number(process.env.DB_PORT),
});
