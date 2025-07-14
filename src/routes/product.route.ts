import express, { Router } from 'express';
import ProductController from '@controller/product.controller';

const router: Router = express.Router();
const productController = new ProductController();

router
    .route('/')
    .get(productController.getAllProduct)
    .post(productController.createProduct);
router
    .route('/:id')
    .get(productController.getByIdProduct)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct);

export default router;
