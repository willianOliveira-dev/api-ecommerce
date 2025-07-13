import { Router, Request, Response } from 'express';
import CustomerRepository from '@repository/CustomerRepository';
import orderValuesArray from '@utils/orderValuesArray';

const router: Router = Router();

interface CustomerBody<T> {
    [column: string]: T;
}

router
    .route('/')
    .get(async (_, res: Response): Promise<void> => {
        const customer: CustomerRepository = new CustomerRepository();
        const result: any = await customer.getAll();
        res.status(200).send(result);
    })
    .post(
        async (
            req: Request<{ body: CustomerBody<unknown> }>,
            res: Response
        ): Promise<void> => {
            const { body } = req;
            const customer: CustomerRepository = new CustomerRepository();
            const valuesArray = orderValuesArray(body, [
                'first_name',
                'last_name',
                'email',
                'password_hash',
            ]);

            const result = await customer.createCustomer<unknown>(valuesArray);
            res.status(201).send(result);
        }
    );

router
    .route('/:id')
    .get(async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const { id } = req.params;
        const customer: CustomerRepository = new CustomerRepository();
        const result = await customer.getById(id);
        res.status(200).send(result);
    })
    .put(
        async (
            req: Request<{ body: CustomerBody<unknown>; id: string }>,
            res: Response
        ): Promise<void> => {
            const { id } = req.params;
            const { body } = req;
            const customer: CustomerRepository = new CustomerRepository();
            const valuesArray = orderValuesArray(body, [
                'first_name',
                'last_name',
                'email',
                'password_hash',
            ]);
            const result = await customer.updateCustomer<unknown>(
                valuesArray,
                id
            );
            res.status(201).send(result);
        }
    )
    .delete(async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const customer: CustomerRepository = new CustomerRepository();
        const result = await customer.deleteCustomer(id);
        res.status(200).send(result);
    });

export default router;
