import { Router, Request, Response } from 'express';
import ProductRepository from '@repository/ProductRepository';
import orderValuesArray from '@utils/orderValuesArray';

const router: Router = Router();

interface ProductBody<T> {
    [column: string]: T;
}

router
    .route('/')
    .get(async (_, res: Response): Promise<void> => {
        const product: ProductRepository = new ProductRepository();
        const result: any = await product.getAll();
        res.status(200).send(result);
    })
    .post(
        async (
            req: Request<{ body: ProductBody<unknown> }>,
            res: Response
        ): Promise<void> => {
            const { body } = req;
            const product: ProductRepository = new ProductRepository();
            const valuesArray = orderValuesArray(body, [
                'name',
                'description',
                'price_cents',
                'size',
                'gender',
                'category',
            ]);

            const result = await product.createProduct<unknown>(valuesArray);
            res.status(201).send(result);
        }
    );

router
    .route('/:id')
    .get(async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const { id } = req.params;
        const product: ProductRepository = new ProductRepository();
        const result = await product.getById(id);
        res.status(200).send(result);
    })
    .put(
        async (
            req: Request<{ body: ProductBody<unknown>; id: string }>,
            res: Response
        ): Promise<void> => {
            const { id } = req.params;
            const { body } = req;
            const product: ProductRepository = new ProductRepository();
            const valuesArray = orderValuesArray(body, [
                'name',
                'description',
                'price_cents',
                'size',
                'gender',
                'category',
            ]);
            const result = await product.updateProduct<unknown>(
                valuesArray,
                id
            );
            res.status(201).send(result);
        }
    )
    .delete(async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const product: ProductRepository = new ProductRepository();
        const result = await product.deleteProduct(id);
        res.status(200).send(result);
    });

export default router;
