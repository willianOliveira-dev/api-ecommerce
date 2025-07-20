import { pool } from '@config/connect';
import { type QueryConfig } from 'pg';
import BaseRepository from '@repository/BaseRepository';

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
    constructor() {
        super();
    }
    private _productEntity: string = 'products';

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

    public async searchByName<T = Product>(
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

        console.log(query)

        try {
            const results = await pool.query(query);
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

    public async deleteProduct<T = Product>(id: string): Promise<T> {
        return await super.delete(this._productEntity, id);
    }
}
