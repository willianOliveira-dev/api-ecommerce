import BaseRepository from 'repositories/BaseRepository';
import { pool } from '@config/connect';
import { type QueryConfig } from 'pg';
import { error } from 'node:console';
import NotFoundError from '@utils/errors/NotFoundError';

interface Product {
    product_id: string;
    name: string;
    quantity: number;
    description: string;
    price_cents: number;
    size: string;
    gender: string;
    category: string;
}

export default class ProductRepository extends BaseRepository {
    private _productEntity: string = 'products';

    constructor() {
        super();
    }

    public override async getAll<T = Product>(): Promise<T[]> {
        return await super.getAll(this._productEntity, [
            'product_id',
            'name',
            'quantity',
            'description',
            'price_cents',
            'size',
            'gender',
            'category',
        ]);
    }

    public override async getById<T = Product>(id: string): Promise<T> {
        return await super.getById(
            this._productEntity,
            [
                'product_id',
                'name',
                'quantity',
                'description',
                'price_cents',
                'size',
                'gender',
                'category',
            ],
            id
        );
    }

    public async searchByNameOrCategory<T = Product>(
        name?: string,
        category?: string
    ): Promise<T[]> {
        const values: string[] = [];
        const conditions: string[] = [];

        if (name) {
            values.push(`%${name.toLowerCase()}%`);
            conditions.push(`LOWER(name) LIKE $${values.length}`);
        }

        if (category) {
            values.push(`${category.toLowerCase()}`);
            conditions.push(`LOWER(category) = $${values.length}`);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(values.length > 1 ? ' AND ' : '')}`
                : '';

        const query: QueryConfig = {
            text: `SELECT * FROM ${this._productEntity} ${whereClause};`,
            values: values,
        };

        try {
            const results = await pool.query(query);
            if (results.rowCount === 0) {
                throw new NotFoundError(
                    'The search result by name or category was not found.'
                );
            }

            return results.rows;
        } catch (err: unknown) {
            ProductRepository._handleError(err);
        }
    }

    public async createProduct<V, T = Product>(valuesArray: V[]): Promise<T> {
        return await super.create(
            this._productEntity,
            [
                'name',
                'quantity',
                'description',
                'price_cents',
                'size',
                'gender',
                'category',
            ],
            valuesArray
        );
    }

    public async updateProduct<V, T = Product>(
        valuesArray: V[],
        id: string
    ): Promise<T> {
        return await super.update(
            this._productEntity,
            [
                'name',
                'quantity',
                'description',
                'price_cents',
                'size',
                'gender',
                'category',
            ],
            valuesArray,
            id
        );
    }

    public async updateQuantity(
        product_id: string,
        amountSold: number
    ): Promise<void> {
        const query: QueryConfig = {
            text: `UPDATE ${this._productEntity} SET quantity = quantity - $1 WHERE product_id = $2 `,
            values: [amountSold, product_id],
        };
        await pool.query(query);
    }

    public async deleteProduct<T = Product>(id: string): Promise<T> {
        return await super.delete(this._productEntity, id);
    }
}
