import express, { type Router } from 'express';
import PurchaseController from '@controller/purchase.controller';
import purchaseSchema from '@validations/purchase.schema';
import validateCustomer from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';

const router: Router = express();
const purchaseController: PurchaseController = new PurchaseController();

router
    .route('/')
    .get(authMiddleware, purchaseController.getAllPurchase)
    .post(
        authMiddleware,
        validateCustomer(purchaseSchema),
        purchaseController.createPurchase
    );

router.route('/:id').get(authMiddleware, purchaseController.getByIdPurchase);

router
    .route('/cancel/:id')
    .post(authMiddleware, purchaseController.cancelPurchase);

export default router;
