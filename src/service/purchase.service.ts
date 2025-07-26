import PurchaseRepository from '@repository/PurchaseRepository';
import PurchaseProductRepository from '@repository/PurchaseProductRepository';
import ProductRepository from '@repository/ProductRepository';
import priceConvertion from '@utils/priceConvertion';
import orderValuesArray from '@utils/orderValuesArray';

const purchase = new PurchaseRepository();

export default class PurchaseService {
    public async getAllPurchase() {
        return await purchase.getAll();
    }

    public async getByIdPurchase(id: string) {
        return await purchase.getById(id);
    }

    public async createPurchase(body: any) {
        const { products, ...bodyRequest } = body;
        const productRepo: ProductRepository = new ProductRepository();
        const purchaseProductRepo: PurchaseProductRepository =
            new PurchaseProductRepository();
        const stockChecks = await Promise.all(
            products.map(
                async ({
                    product_id,
                    product_amount,
                }: {
                    product_id: string;
                    product_amount: number;
                }) => {
                    const { quantity } = await productRepo.getById(product_id);
                    return quantity >= product_amount;
                }
            )
        );
        const isStock = stockChecks.every(Boolean);

        if (isStock) {
            const createProduct = await purchase.createPurchase(
                orderValuesArray(bodyRequest, [
                    'customer_id',
                    'purchase_date',
                    'delivery_address',
                    'status',
                ])
            );

            const { purchase_id } = createProduct;

            for (let product of products) {
                const { product_id, product_amount, price_cents_at_purchase } =
                    product;
                await purchaseProductRepo.createPurchaseProduct([
                    purchase_id,
                    product_id,
                    product_amount,
                    priceConvertion(price_cents_at_purchase, 'toCents'),
                ]);

                await productRepo.updateQuantity(product_id, product_amount);
            }
            return createProduct;
        }
        return {
            message: 'Requested quantity unavailable.',
            details: 'Exceeds current stock limit.',
        };
    }

    public async cancelPurchase(id: string) {
        return await purchase.cancelPurchase(id);
    }

    public async deletePurchase(id: string) {
        return await purchase.deletePurchase(id);
    }
}
