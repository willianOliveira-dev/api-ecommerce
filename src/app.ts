import 'dotenv/config';
import express, { Express } from 'express';
import customersRouter from '@routes/customer.route';
import productsRouter from '@routes/product.route';

const app: Express = express();
const PORT: number = 8080;

app.use(express.json());
app.use('/customers', customersRouter);
app.use('/products', productsRouter);

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});
