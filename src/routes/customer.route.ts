import express, { Router } from 'express';
import CustomerController from '@controller/customer.controller';
import customerSchema from '@validations/customer.schema';
import { validation as validateCustomer } from '@middlewares/index';

const router: Router = express.Router();
const customerController = new CustomerController();

validateCustomer(customerSchema)
router
    .route('/')
    .get(customerController.getAllCustomer)
    .post(validateCustomer(customerSchema), customerController.createCustomer);
router
    .route('/:id')
    .get(customerController.getByIdCustomer)
    .put(validateCustomer(customerSchema), customerController.updateCustomer)
    .delete(customerController.deleteCustomer);
    
export default router;
