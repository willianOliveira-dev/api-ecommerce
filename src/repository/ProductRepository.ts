import BaseRepository from '@repository/BaseRepository';

interface Product {
    product_id: string;
    name: string;
    description: string;
    price_cents: number;
    size: string;
    gender: string;
    category: string;
}

export default class ProductRepository extends BaseRepository {
    private productEntity: string = 'products';

    public override async getAll<T = Product>(): Promise<T[]> {
        return await super.getAll(this.productEntity, [
            'product_id',
            'name',
            'description',
            'price_cents',
            'size',
            'gender',
            'category',
        ]);
    }

    public override async getById<T = Product>(id: string): Promise<T> {
        return await super.getById(
            this.productEntity,
            [
                'product_id',
                'name',
                'description',
                'price_cents',
                'size',
                'gender',
                'category',
            ],
            id
        );
    }

    public async createProduct<V, T = Product>(valuesArray: V[]): Promise<T> {
        return await super.create(
            this.productEntity,
            [
                'name',
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
            this.productEntity,
            [
                'name',
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
        return await super.delete(this.productEntity, id);
    }
}


