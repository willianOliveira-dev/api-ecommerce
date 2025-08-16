import express, { type Router } from 'express';
import PurchaseController from 'controllers/purchase.controller';
import purchaseSchema from '@validations/purchase.schema';
import validateCustomer from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';

const router: Router = express();
const purchaseController: PurchaseController = new PurchaseController();

//POST - /api/purchases
/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: Cria um novo pedido  (requer autenticação)
 *     description: |
 *       - Requer autenticação JWT (customer_id vinculado automaticamente)
 *       - Valida estoque e formato dos dados
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             delivery_address: "Rua Exemplo, 001 – SP, CEP 00000-000"
 *             products:
 *               - product_id: "550e8400-e29b-41d4-a716-446655440000"
 *                 product_amount: 2
 *                 price_cents: 5999
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               purchase_id: "1f5408d0-170d-4c45-9b25-5b713da9c70f"
 *               customer_id: "76a11b40-f3d0-41aa-a313-c06e551a8c03"
 *               purchase_date: "2025-08-07T21:46:15.822Z"
 *               delivery_address: "Rua Exemplo, 001 – SP, CEP 00000-000"
 *               status: "confirmed"
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       403:
 *         description: Proibido
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden"
 *               details: ["Detailed Error Message"]
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             example:
 *               message: "Access Denied"
 *               details: ["Detailed Error Message"]
 *       500:
 *         description: Erro interno do servidor
 */
// GET - /api/purchases
/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: Lista todos os pedidos do cliente (requer autenticação)
 *     description: |
 *       - Filtra automaticamente por customer_id do JWT
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário logado
 *         content:
 *           application/json:
 *             example:
 *               - purchase_id: "1f5408d0-170d-4c45-9b25-5b713da9c70f"
 *                 customer_id: "76a11b40-f3d0-41aa-a313-c06e551a8c03"
 *                 purchase_date: "2025-08-07T21:46:15.822Z"
 *                 delivery_address: "Rua Exemplo, 001 – SP, CEP 00000-000"
 *                 status: "confirmed"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             example:
 *               message: "Access Denied"
 *               details: ["Detailed Error Message"]
 *       500:
 *         description: Erro interno do servidor
 */
router
    .route('/')
    .get(authMiddleware, purchaseController.getAllPurchase)
    .post(
        authMiddleware,
        validateCustomer(purchaseSchema),
        purchaseController.createPurchase
    );

// GET - /api/purchases/{id}
/**
 * @swagger
 * /api/purchases/{id}:
 *   get:
 *     summary: Obtém um pedido específico do cliente (requer autenticação)
 *     description: |
 *       - Valida se o pedido pertence ao customer_id do JWT
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1f5408d0-170d-4c45-9b25-5b713da9c70f"
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             example:
 *               purchase_id: "1f5408d0-170d-4c45-9b25-5b713da9c70f"
 *               customer_id: "76a11b40-f3d0-41aa-a313-c06e551a8c03"
 *               purchase_date: "2025-08-07T21:46:15.822Z"
 *               delivery_address: "Rua Exemplo, 001 – SP, CEP 00000-000"
 *               status: "confirmed"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       403:
 *         description: Proibido
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden"
 *               details: ["Detailed Error Message"]
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["Purchase not found."]
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             example:
 *               message: "Access Denied"
 *               details: ["Detailed Error Message"]
 *       500:
 *         description: Erro interno do servidor
 */
router.route('/:id').get(authMiddleware, purchaseController.getByIdPurchase);

// POST - /api/purchases/cancel/{id}
/**
 * @swagger
 * /api/purchases/cancel/{id}:
 *   post:
 *     summary: Cancela um pedido do cliente (requer autenticação)
 *     description: |
 *       - Valida se o pedido pertence ao customer_id do JWT
 *       - Atualiza status para "cancelled"
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1f5408d0-170d-4c45-9b25-5b713da9c70f"
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               purchase_id: "1f5408d0-170d-4c45-9b25-5b713da9c70f"
 *               status: "cancelled"
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       403:
 *         description: Proibido
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden"
 *               details: ["Detailed Error Message"]
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             example:
 *               message: "Access Denied"
 *               details: ["Detailed Error Message"]
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["Purchase not found."]
 *       500:
 *         description: Erro interno do servidor
 */
router
    .route('/cancel/:id')
    .post(authMiddleware, purchaseController.cancelPurchase);

export default router;
