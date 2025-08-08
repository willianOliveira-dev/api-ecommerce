import PurchaseRepository from '@repository/PurchaseRepository';
import PurchaseProductRepository from '@repository/PurchaseProductRepository';
import ProductRepository from '@repository/ProductRepository';
import priceConvertion from '@utils/priceConvertion';
import NotFoundError from '@utils/errors/NotFoundError';
import ForbiddenError from '@utils/errors/ForbiddenError';

const purchase = new PurchaseRepository();

export default class PurchaseService {
    
    public async getAllPurchaseByCustomer(customer_id: string) {
        return await purchase.getAllPurchaseByCustomer(customer_id);
    }

    public async getPurchaseByIdAndCustomer(id: string, customer_id: string) {
        const purchaseData = await purchase.getById(id);

        if (!purchaseData) {
            throw new NotFoundError('Purchase not found.');
        }

        if (purchaseData.customer_id !== customer_id) {
            throw new ForbiddenError('Unauthorized access to this purchase.');
        }

        return purchaseData;
    }

    public async createPurchase(body: any) {
        const { products, ...bodyRequest } = body;
        const { customer_id, purchase_date, delivery_address, status } =
            bodyRequest;
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
            const createProduct = await purchase.createPurchase([
                customer_id,
                purchase_date ?? new Date(),
                delivery_address,
                status ?? 'confirmed',
            ]);

            const { purchase_id } = createProduct;

            for (let product of products) {
                const { product_id, product_amount, price_cents } = product;
                await purchaseProductRepo.createPurchaseProduct([
                    purchase_id,
                    product_id,
                    product_amount,
                    priceConvertion(price_cents, 'toCents'),
                ]);

                await productRepo.updateQuantity(product_id, product_amount);
            }
            return createProduct;
        }
        throw new ForbiddenError('Exceeds current stock limit.');
    }

    public async cancelPurchase(id: string, customer_id: string) {
        const purchaseData = await purchase.getById(id);

        if (!purchaseData) {
            throw new NotFoundError('Purchase not found.');
        }

        if (purchaseData.customer_id !== customer_id) {
            throw new ForbiddenError('Unauthorized access to delete this purchase.');
        }

        return await purchase.cancelPurchase(id);
    }

    public async deletePurchase(id: string) {
        return await purchase.deletePurchase(id);
    }
}
