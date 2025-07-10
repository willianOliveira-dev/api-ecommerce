import BaseRepository from '@repository/BaseRepository';

export default class ProductRepository extends BaseRepository {
    public async getAll(): Promise<any> {
        return await super.getAll('products', [
            'product_id',
            'name',
            'description',
            'price_cents',
            'size',
            'gender',
            'category',
        ]);
    }

    public async getById(id: string): Promise<any> {
        return await super.getById(
            'products',
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
}
