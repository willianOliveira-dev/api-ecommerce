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

    public async getAllPurchaseByCustomer<T = Purchase>(
        customer_id: string
    ): Promise<T[]> {
        const query = {
            text: `SELECT * FROM purchases WHERE customer_id = $1;`,
            values: [customer_id],
        };
        const result = await pool.query(query);
        return result.rows;
    }

    public override async getById<T = Purchase>(id: string): Promise<T> {
        return await super.getById(
            this._purchaseEntity,
            [
                'purchase_id',
                'customer_id',
                'purchase_date',
                'delivery_address',
                'status',
            ],
            id
        );
    }

    public async createPurchase<V, T = Purchase>(valuesArray: V[]): Promise<T> {
        return await super.create(
            this._purchaseEntity,
            ['customer_id', 'purchase_date', 'delivery_address', 'status'],
            valuesArray
        );
    }

    public async cancelPurchase<T = Purchase>(id: string): Promise<T[]> {
        const client: PoolClient = await pool.connect();
        try {
            await client.query('BEGIN;');

            const purchaseQuery: QueryConfig = {
                text: 'SELECT * FROM purchases WHERE purchase_id = $1',
                values: [id],
            };

            const purchaseResults = await client.query(purchaseQuery);

            if (purchaseResults.rows[0].status === 'cancelled') {
                PurchaseRepository._handleError('Purchase already canceled.');
            }

            const productQuery: QueryConfig = {
                text: 'SELECT * FROM purchaseproduct WHERE purchase_id = $1;',
                values: [id],
            };

            const productResults = await client.query(productQuery);

            for (let product of productResults.rows) {
                const updateStockQuery: QueryConfig = {
                    text: `UPDATE products SET quantity = quantity + $1 WHERE product_id = $2`,
                    values: [product.product_amount, product.product_id],
                };
                await client.query(updateStockQuery);
            }

            const cancelQuery: QueryConfig = {
                text: `UPDATE ${this._purchaseEntity} SET status = $1 WHERE purchase_id = $2 RETURNING *`,
                values: ['cancelled', id],
            };

            const cancelResults = await client.query(cancelQuery);

            await client.query('COMMIT;');
            return cancelResults.rows;
        } catch (err: unknown) {
            await client.query('ROLLBACK;');
            PurchaseRepository._handleError(err);
        } finally {
            client.release();
        }
    }

    public async deletePurchase<T = Purchase>(id: string): Promise<T> {
        return await super.delete(this._purchaseEntity, id);
    }
}
