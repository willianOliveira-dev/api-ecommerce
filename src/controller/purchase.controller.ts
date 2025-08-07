import PurchaseService from '@service/purchase.service';
import { type Request, type Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

const purchaseService = new PurchaseService();

export default class PurchaseController {
    
    public async getAllPurchase(req: Request, res: Response): Promise<void> {
        const { user } = req;
        const result = await purchaseService.getAllPurchaseByCustomer(
            (user as JwtPayload).id
        );
        res.status(200).send(result);
    }

    public async getByIdPurchase(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { user } = req;
        const result = await purchaseService.getPurchaseByIdAndCustomer(
            id,
            (user as JwtPayload).id
        );

        res.status(200).send(result);
    }

    public async createPurchase(req: Request, res: Response): Promise<void> {
        const { body, user } = req;
        const purchaseData = {
            ...body,
            customer_id: (user as JwtPayload).id,
        };
        const result = await purchaseService.createPurchase(purchaseData);
        res.status(201).send(result);
    }

    public async cancelPurchase(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const result = await purchaseService.cancelPurchase(id);
        res.status(200).send(result);
    }

    public async deletePurchase(req: Request, res: Response) {
        const { id } = req.params;
        const result = await purchaseService.deletePurchase(id);
        res.status(200).send(result);
    }
}
