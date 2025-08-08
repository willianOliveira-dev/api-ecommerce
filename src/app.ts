import 'dotenv/config';
import express, { type Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import errorHandler from '@middlewares/errorHandler';
import createLogs from '@utils/createLogs';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from 'swaggerConfig';

import {
    customersRouter,
    loginRouter,
    productsRouter,
    purchasesRouter,
} from '@routes/index.route';

const app: Express = express();
const PORT: number = 8080;

const startServer: () => Promise<void> = async () => {
    app.use(express.json());
    app.use(cors());
    app.use(morgan('dev'));
    const stream = await createLogs();
    app.use(morgan('combined', { stream }));
    app.use(helmet());
    app.use(cookieParser());
    app.use(
        '/api-ecommerce-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
    );
    app.use('/api/auth/login', loginRouter);
    app.use('/api/customers', customersRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/purchases', purchasesRouter);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.info(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
