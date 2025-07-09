import { pool } from '@repository/database';

export default class BaseRepository {
    async getAll(table: string): Promise<any[]> {
        try {
            const results: any[] = (await pool.query(`SELECT * FROM ${table};`))
                .rows;
            return results;
        } catch (e: unknown) {
            console.error(e);
            return [];
        }
    }
}
