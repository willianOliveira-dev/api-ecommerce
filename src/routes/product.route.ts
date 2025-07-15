import express, { Router } from 'express';
import ProductController from '@controller/product.controller';
import productSchema from '@validations/product.schema';
import { validation as validateProduct } from '@middlewares/index';

const router: Router = express.Router();
const productController = new ProductController();

router
    .route('/')
    .get(productController.getAllProduct)
    .post(validateProduct(productSchema), productController.createProduct);
router
    .route('/:id')
    .get(productController.getByIdProduct)
    .put(validateProduct(productSchema), productController.updateProduct)
    .delete(productController.deleteProduct);

export default router;
