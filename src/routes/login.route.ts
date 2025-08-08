import express, { type Router } from 'express';
import AuthController from '@controller/auth.controller';
import authSchema from '@validations/auth.schema';
import validateAuth from '@middlewares/validation.middleware';

const router: Router = express.Router();
const authController: AuthController = new AuthController();

//JWT
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Insira o token sem "Bearer "
 */
// POST - /api/auth/login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna token JWT
 *     description: |
 *       ### Como usar o token:
 *       1. **Copie** o token retornado nesta resposta
 *       2. **No Swagger UI**:
 *          - Clique no botão "Authorize"
 *          - Cole o token no campo "Value" (sem "Bearer")
 *          - Todas as rotas protegidas usarão automaticamente este token
 *       3. **Em requisições manuais**:
 *          - Adicione no cabeçalho:
 *            `Authorization: Bearer {token}`
 *
 *       ### Detalhes do token:
 *       - Validade: 24 horas
 *       - Contém: `customer_id` do usuário
 *       - Rotas protegidas: Todas marcadas com `security: [bearerAuth]`
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "usuario@exemplo.com"
 *             password_hash: "senha123"
 *     responses:
 *       200:
 *         description: Token JWT gerado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Invalid email format", "The password field is required"]
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             examples:
 *               invalid-email:
 *                 value:
 *                   message: "Error"
 *                   details: ["User not found!"]
 *               invalid-password:
 *                 value:
 *                   message: "Error"
 *                   details: ["Invalid password"]
 *       500:
 *         description: Erro interno do servidor
 */
router.route('/').post(validateAuth(authSchema), authController.login);

export default router;
