import { pool } from '@config/connect';
import { QueryConfig, type PoolClient } from 'pg';
import BaseRepository from './BaseRepository';

interface Purchase {
    purchase_id: string;
    customer_id: string;
    purchase_date: string;
    delivery_address: string;
}

export default class PurchaseRepository extends BaseRepository {
    private _purchaseEntity: string = 'purchases';

    constructor() {
        super();
    }

    public override async getAll<T = Purchase>(): Promise<T[]> {
        return await super.getAll(this._purchaseEntity, [
            'purchase_id',
            'customer_id',
            'purchase_date',
            'delivery_address',
        ]);
    }

    public override async getById<T = Purchase>(id: string): Promise<T> {
        return await super.getById(
            this._purchaseEntity,
            ['purchase_id', 'customer_id', 'purchase_date', 'delivery_address'],
            id
        );
    }

    public async createPurchase<V, T = Purchase>(valuesArray: V[]): Promise<T> {
        return await super.create(
            this._purchaseEntity,
            ['purchase_id', 'customer_id', 'purchase_date', 'delivery_address'],
            valuesArray
        );
    }

    public async cancelPurchase<T = Purchase>(id: string): Promise<T[]> {
        const client: PoolClient = await pool.connect();
        try {
            const query: QueryConfig = {
                text: `UPDATE ${this._purchaseEntity} SET status = $1 WHERE purchase_id = $2 RETURNING *`,
                values: ['cancelled', id],
            };
            await client.query('BEGIN;');
            const results = await client.query(query);
            await client.query('COMMIT;');
            return results.rows;
        } catch (err: unknown) {
            await client.query('ROLLBACK;');
            PurchaseRepository._handleError(err);
        }
    }

    public async deletePurchase<T = Purchase>(id: string): Promise<T> {
        return await super.delete(this._purchaseEntity, id);
    }
}
