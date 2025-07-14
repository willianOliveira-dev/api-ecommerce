import { pool } from '@config/connect';
import { PoolClient, QueryConfig } from 'pg';

interface ResultQuery {
    [columns: string]: any;
}
interface Entities {
    readonly customers: string;
    readonly products: string;
    readonly purchases: string;
    readonly purchaseproduct: string;
    readonly [table: string]: string;
}

const TABLES: ReadonlyArray<string> = [
    'customers',
    'products',
    'purchases',
    'purchaseproduct',
];

type TableName = (typeof TABLES)[number];

export default abstract class BaseRepository {
    private static _handleError(err: unknown): never {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(String(err));
    }

    private static _tableIdMap: Entities = {
        customers: 'customer_id',
        products: 'product_id',
        purchases: 'purchase_id',
        purchaseproduct: 'purchaseproduct_id',
    };

    public async getAll<T = ResultQuery>(
        table: TableName,
        columnsArray: string[]
    ): Promise<T[]> {
        try {
            if (!BaseRepository._tableIdMap[table])
                throw new Error(`Invalid or unmapped table: ${table}`);

            const columns: string = columnsArray.join(', ');
            const query: QueryConfig = {
                text: `SELECT ${columns} FROM ${table};`,
            };
            const results = await pool.query(query);

            if (results.rowCount === 0)
                throw new Error(`No records found in table ${table}`);

            return results.rows;
        } catch (err: unknown) {
            BaseRepository._handleError(err);
        }
    }

    public async getById<T = ResultQuery>(
        table: TableName,
        columnsArray: string[],
        id: string
    ): Promise<T> {
        try {
            const columns: string = columnsArray.join(', ');
            const columnId: string = BaseRepository._tableIdMap[table];

            if (!columnId) throw new Error(`Table ${table} not mapped`);
            const query: QueryConfig = {
                text: `SELECT ${columns} FROM ${table} WHERE ${columnId} = $1;`,
                values: [id],
            };
            const result = (await pool.query(query)).rows[0];

            if (!result)
                throw new Error(
                    `Record with ID ${id} not found in table ${table}`
                );

            return result;
        } catch (err: unknown) {
            BaseRepository._handleError(err);
        }
    }

    public async create<V, T = ResultQuery>(
        table: TableName,
        columnsArray: string[],
        valuesArray: V[]
    ): Promise<T> {
        const client: PoolClient = await pool.connect();
        try {
            const columns: string = columnsArray.join(', ');
            const placeholdersPg: string = valuesArray
                .map((_, index) => `$${index + 1}`)
                .join(',');
            const query: QueryConfig = {
                text: `INSERT INTO ${table} (${columns}) VALUES (${placeholdersPg}) RETURNING *;`,
                values: valuesArray,
            };
            await client.query('BEGIN;');
            const { password_hash, ...result } = (await client.query(query))
                .rows[0];
            await client.query('COMMIT;');
            return result;
        } catch (err: unknown) {
            await client.query('ROLLBACK;');
            BaseRepository._handleError(err);
        } finally {
            client.release(); // ENCERRA CONEXÃO
        }
    }

    public async update<V, T = ResultQuery>(
        table: TableName,
        columnsArray: string[],
        valuesArray: V[],
        id: string
    ): Promise<T> {
        const client: PoolClient = await pool.connect();
        try {
            const setClause = columnsArray.map(
                (col: string, index: number) => `${col} = $${index + 1}`
            );
            const columnId: string = BaseRepository._tableIdMap[table];

            if (!columnId) throw new Error(`Table ${table} not mapped`);

            const query: QueryConfig = {
                text: `UPDATE ${table} SET ${setClause.join(
                    ', '
                )} WHERE ${columnId} = ${setClause.length + 1} RETURNING *;`,
                values: [...valuesArray, id],
            };
            await client.query('BEGIN;');
            const { password_hash, ...result } = (await client.query(query))
                .rows[0];
            await client.query('COMMIT;');
            return result;
        } catch (err: unknown) {
            await client.query(`ROLLBACK`);
            BaseRepository._handleError(err);
        } finally {
            client.release();
        }
    }

    public async delete<T = ResultQuery>(
        table: TableName,
        id: string
    ): Promise<T> {
        const client: PoolClient = await pool.connect();
        try {
            const columnId: string = BaseRepository._tableIdMap[table];
            if (!columnId) throw new Error(`Table ${table} not mapped`);
            await client.query('BEGIN;');
            const query: QueryConfig = {
                text: `DELETE FROM ${table} WHERE ${columnId} = $1 RETURNING *;`,
                values: [id],
            };
            const { password_hash, ...result } = (await client.query(query))
                .rows[0];
            await client.query('COMMIT;');
            return result;
        } catch (err: unknown) {
            await client.query('ROLLBACK;');
            BaseRepository._handleError(err);
        }
    }
}
