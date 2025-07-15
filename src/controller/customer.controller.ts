import { Request, Response } from 'express';
import CustomerService from '@service/customer.service';

const customerService = new CustomerService();

export default class {
    public async getAllCustomer(req: Request, res: Response): Promise<void> {
        const result = (await customerService.getAllCustomer()).map(
            ({ password_hash, ...rest }) => rest
        );

        res.status(200).send(result);
    }

    public async getByIdCustomer(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { password_hash, ...result } =
            await customerService.getByIdCustomer(id);
        res.status(200).send(result);
    }

    public async createCustomer(req: Request, res: Response): Promise<void> {
        const { body } = req;
        const { password_hash, ...result } =
            await customerService.createCustomer(body);
        res.status(201).send(result);
    }

    public async updateCustomer(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { body } = req;
        const { password_hash, ...result } =
            await customerService.updateCustomer(body, id);
        res.status(201).send(result);
    }

    public async deleteCustomer(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { password_hash, ...result } =
            await customerService.deleteCustomer(id);
        res.status(200).send(result);
    }
}
