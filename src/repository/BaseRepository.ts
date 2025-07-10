import { pool } from '@repository/database';
import { QueryConfig, QueryResult } from 'pg';

export default class BaseRepository {
    private static handleError(err: unknown): never {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(String(err));
    }

    private static tableIdMap: { [key: string]: string } = {
        customers: 'customer_id',
        products: 'product_id',
        purchases: 'purchase_id',
        purchaseproduct: 'purchaseproduct_id',
    };

    public async getAll(
        table: string,
        columnsArray: string[]
    ): Promise<Record<string, any>[]> {
        try {
            if (!BaseRepository.tableIdMap[table])
                throw new Error(`Invalid or unmapped table: ${table}`);

            const columns: string = columnsArray.join(', ');
            const query: QueryConfig = {
                text: `SELECT ${columns} FROM ${table};`,
            };
            const results: QueryResult<Record<string, any>> = await pool.query(
                query
            );

            if (results.rowCount === 0)
                throw new Error(`No records found in table ${table}`);

            return results.rows;
        } catch (err: unknown) {
            BaseRepository.handleError(err);
        }
    }

    public async getById(
        table: string,
        columnsArray: string[],
        id: string
    ): Promise<Record<string, any>> {
        try {
            const columns: string = columnsArray.join(', ');
            const columnId = BaseRepository.tableIdMap[table];

            if (!columnId) throw new Error(`Table ${table} not mapped`);
            const query: QueryConfig = {
                text: `SELECT ${columns} FROM ${table} WHERE ${columnId} = $1;`,
                values: [id],
            };
            const result: Record<string, any> = (await pool.query(query))
                .rows[0];

            if (!result)
                throw new Error(
                    `Record with ID ${id} not found in table ${table}`
                );
            return result;
        } catch (err: unknown) {
            BaseRepository.handleError(err);
        }
    }

    public async create(
        table: string,
        columnsArray: string[],
        valuesArray: any[]
    ) {
        const client = await pool.connect();
        try {
            const columns: string = columnsArray.join(', ');
            const placeholdersPg: string = valuesArray
                .map((_, index) => `$${index + 1}`)
                .join(',');
            const query: QueryConfig = {
                text: `INSERT INTO ${table} (${columns}) VALUES (${placeholdersPg});`,
                values: valuesArray,
            };
            await client.query('BEGIN;');
            await client.query(query);
            await client.query('COMMIT;');
        } catch (err: unknown) {
            await client.query('ROLLBACK;');
            BaseRepository.handleError(err);
        } finally {
            client.release(); // ENCERRA CONEXÃO
        }
    }
}
