import 'dotenv/config';
import express, { Express } from 'express';
import customersRouter from '@routes/customers';

const app: Express = express();
const PORT: number = 8080;

app.use(express.json());
app.use('/customers', customersRouter);

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});

