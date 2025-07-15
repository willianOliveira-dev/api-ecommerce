import 'dotenv/config';
import express, { Express } from 'express';
import customersRouter from '@routes/customer.route';
import productsRouter from '@routes/product.route';
import { errorHandler } from '@middlewares/index';
import fs from 'node:fs';
import path from 'node:path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app: Express = express();
const PORT: number = 8080;

const logFolder = path.join(__dirname, 'logs');
if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
}
const logFile = fs.createWriteStream(path.join(logFolder, 'access.log'), {
    flags: 'a',
});

app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: logFile }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use('/customers', customersRouter);
app.use('/products', productsRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});
