import BaseRepository from 'repositories/BaseRepository';

interface PurchaseProduct {
    purchaseproduct_id: string;
    purchase_id: string;
    product_id: string;
    product_amount: string;
    price_cents_at_purchase: string;
}

export default class PurchaseProductRepository extends BaseRepository {
    private _purchaseproduct = 'purchaseproduct';

    constructor() {
        super();
    }

    public override async getAll<T = PurchaseProduct>(): Promise<T[]> {
        return await super.getAll(this._purchaseproduct, [
            'purchaseproduct_id',
            'purchase_id',
            'product_id',
            'product_amount',
            'price_cents',
        ]);
    }

    public override async getById<T = PurchaseProduct>(id: string): Promise<T> {
        return await super.getById(
            this._purchaseproduct,
            [
                'purchaseproduct_id',
                'purchase_id',
                'product_id',
                'product_amount',
                'price_cents',
            ],
            id
        );
    }

    public async createPurchaseProduct<V, T = PurchaseProduct>(
        valuesArray: V[]
    ): Promise<T> {
        return await super.create(
            this._purchaseproduct,
            ['purchase_id', 'product_id', 'product_amount', 'price_cents'],
            valuesArray
        );
    }

    public async deletePurchase<T = PurchaseProduct>(id: string): Promise<T> {
        return await super.delete(this._purchaseproduct, id);
    }
}
