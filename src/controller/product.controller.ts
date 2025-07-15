import { Request, Response } from 'express';
import ProductService from '@service/product.service';
import priceConvertion from '@utils/priceConvertion';

const productService = new ProductService();
export default class {
    public async getAllProduct(req: Request, res: Response): Promise<void> {
        const results = (await productService.getAllProduct()).map(
            (product) => {
                product.price_cents = priceConvertion(
                    product.price_cents,
                    'toReais'
                ) as number;
                return product;
            }
        );
        res.status(200).send(results);
    }
    public async getByIdProduct(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const result = await productService.getByIdProduct(id);
        result.price_cents = priceConvertion(
            result.price_cents,
            'toReais'
        ) as number;
        res.status(200).send(result);
    }

    public async createProduct(req: Request, res: Response): Promise<void> {
        const { body } = req;
        const result = await productService.createProduct(body);
        res.status(201).send(result);
    }

    public async updateProduct(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { body } = req;
        const result = await productService.updateProduct(body, id);
        res.status(201).send(result);
    }

    public async deleteProduct(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const result = await productService.deleteProduct(id);
        res.status(200).send(result);
    }
}
