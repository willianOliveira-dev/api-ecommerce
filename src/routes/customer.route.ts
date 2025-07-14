import express, { Router } from 'express';
import CustomerController from '@controller/customer.controller';

const router: Router = express.Router();
const customerController = new CustomerController();

router
    .route('/')
    .get(customerController.getAllCustomer)
    .post(customerController.createCustomer);
router
    .route('/:id')
    .get(customerController.getByIdCustomer)
    .put(customerController.updateCustomer)
    .delete(customerController.deleteCustomer);
    
export default router;
