import { Router, Request, Response } from 'express';
import CustomerRepository from '@repository/CustomerRepository';
const router: Router = Router();

router
    .route('/')
    .get(async (_, res: Response) => {
        const customer: CustomerRepository = new CustomerRepository();
        const result: any = await customer.getAll();
        res.status(200).send(result);
    })
    .post(
        async (req: Request<{ body: Record<string, any> }>, res: Response) => {
            const { body } = req;
            const customer: CustomerRepository = new CustomerRepository();
            const columnsArray: string[] = [
                'first_name',
                'last_name',
                'email',
                'password_hash',
            ];
            const valuesArray = columnsArray.reduce(
                (acc, columnName): string[] => {
                    acc.push(body[columnName]);
                    return acc;
                },
                []
            );
            await customer.createCustomer(valuesArray);
            res.status(200);
        }
    );

router
    .route('/:id')
    .get(async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const customer = new CustomerRepository();
        const result = await customer.getById(id);
        res.status(200).send(result);
    });

export default router;
