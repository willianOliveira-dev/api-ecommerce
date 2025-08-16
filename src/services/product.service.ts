import ProductRepository from 'repositories/ProductRepository';
import priceConvertion from '@utils/priceConvertion';
import orderValuesArray from '@utils/orderValuesArray';
import updateData from '@utils/udpateData';

const product = new ProductRepository();

export default class ProductService {
    public async getAllProduct() {
        return await product.getAll();
    }

    public async getByIdProduct(id: string) {
        return await product.getById(id);
    }

    public async searchByNameOrCategoryProduct(
        name?: string,
        category?: string
    ) {
        return await product.searchByNameOrCategory(name, category);
    }

    public async createProduct(body: any) {
        body.price_cents = priceConvertion(
            body.price_cents as number,
            'toCents'
        );
        return await product.createProduct(
            orderValuesArray(body, [
                'name',
                'quantity',
                'description',
                'price_cents',
                'size',
                'gender',
                'category',
            ])
        );
    }

    public async updateProduct(body: any, id: string) {
        const selectProduct = await product.getById(id);
        const updatedProduct = updateData(selectProduct, body);
        return await product.updateProduct(
            orderValuesArray(updatedProduct, [
                'name',
                'quantity',
                'description',
                'price_cents',
                'size',
                'gender',
                'category',
            ]),
            id
        );
    }

    public async deleteProduct(id: string) {
        return await product.deleteProduct(id);
    }
}
