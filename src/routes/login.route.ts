import express, { type Router } from 'express';
import AuthController from '@controller/auth.controller';
import authSchema from '@validations/auth.schema';
import validateAuth from '@middlewares/validation.middleware';

const router: Router = express.Router();
const authController: AuthController = new AuthController();

router.route('/').post(validateAuth(authSchema), authController.login);

export default router;
