import express, { type Router } from 'express';
import CustomerController from 'controllers/customer.controller';
import customerSchema from '@validations/customer.schema';
import validateCustomer from '@middlewares/validation.middleware';

const router: Router = express.Router();
const customerController = new CustomerController();
// POST - /api/customers
/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Cadastra um novo cliente
 *     description: |
 *       Cria um registro de cliente com senha criptografada.
 *       - A senha deve ter:
 *         - 8+ caracteres
 *         - Letras maiúsculas/minúsculas
 *         - Números
 *         - Símbolos (!@#$%^&*)
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             first_name: "Carlos"
 *             last_name: "Oliveira"
 *             email: "carlos@exemplo.com"
 *             password_hash: "Senha@123"
 *     responses:
 *       201:
 *         description: Cliente criado
 *         content:
 *           application/json:
 *             example:
 *               customer_id: "660e8400-e29b-41d4-a716-446655440000"
 *               first_name: "Carlos"
 *               last_name: "Oliveira"
 *               email: "carlos@exemplo.com"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       500:
 *         description: Erro interno do servidor
 */
// GET - /api/customers
/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Lista todos os clientes cadastrados
 *     description: |
 *       Retorna um array com todos os clientes.
 *       - Dados sensíveis como `password_hash` são omitidos na resposta
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             example:
 *               - customer_id: "550e8400-e29b-41d4-a716-446655440000"
 *                 first_name: "João"
 *                 last_name: "Silva"
 *                 email: "joao@exemplo.com"
 *       500:
 *         description: Erro interno do servidor
 */
validateCustomer(customerSchema);
router
    .route('/')
    .get(customerController.getAllCustomer)
    .post(validateCustomer(customerSchema), customerController.createCustomer);

// GET - /api/customers/{id}
/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Obtém um cliente específico
 *     description: |
 *       - Dados sensíveis como `password_hash` são omitidos na resposta
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             example:
 *               customer_id: "550e8400-e29b-41d4-a716-446655440000"
 *               first_name: "João"
 *               last_name: "Silva"
 *               email: "joao@exemplo.com"
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["Record with ID {id} not found in table customers"]
 *       500:
 *         description: Erro interno do servidor
 */
// PUT - /customers/{id}
/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     description: |
 *       Atualiza parcial ou totalmente os dados do cliente.
 *       - A senha é automaticamente criptografada
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             first_name: "Carlos"
 *             last_name: "Oliveira Jr"
 *     responses:
 *       200:
 *         description: Dados atualizados
 *         content:
 *           application/json:
 *             example:
 *               customer_id: "550e8400-e29b-41d4-a716-446655440000"
 *               first_name: "Carlos"
 *               last_name: "Oliveira Jr"
 *               email: "carlos@exemplo.com"
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["Record with ID {id} not found in table customers"]
 *       500:
 *         description: Erro interno do servidor
 */
// DELETE - /customers/{id}
/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     description: |
 *       Exclui o registro do cliente e retorna seus dados antes da exclusão.
 *       - **Atenção:** Esta ação é irreversível
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Dados do cliente excluído
 *         content:
 *           application/json:
 *             example:
 *               customer_id: "550e8400-e29b-41d4-a716-446655440000"
 *               first_name: "João"
 *               last_name: "Silva"
 *               email: "joao@exemplo.com"
 *               deleted_at: "2023-01-01T12:00:00Z"
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["Record with ID {id} not found in table customers"]
 *       500:
 *         description: Erro interno
 */
router
    .route('/:id')
    .get(customerController.getByIdCustomer)
    .put(customerController.updateCustomer)
    .delete(customerController.deleteCustomer);

export default router;
