import 'dotenv/config';
import express, { type Express } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import errorHandler from '@middlewares/errorHandler';
import { customersRouter, loginRouter, productsRouter} from '@routes/index.route';

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
app.use('/login', loginRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});
