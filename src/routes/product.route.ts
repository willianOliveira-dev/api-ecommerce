import express, { type Router } from 'express';
import ProductController from '@controller/product.controller';
import productSchema from '@validations/product.schema';
import validateProduct from '@middlewares/validation.middleware';

const router: Router = express.Router();
const productController = new ProductController();

// POST - /api/products
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *               - price_cents
 *               - size
 *               - gender
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Camiseta Polo
 *               quantity:
 *                 type: number
 *                 example: 10
 *               description:
 *                 type: string
 *                 example: Camiseta confortável de algodão
 *               price_cents:
 *                 type: number
 *                 example: 4999
 *               size:
 *                 type: string
 *                 enum: [PP, P, M, G, GG, XG, XGG, EG]
 *                 example: M
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 example: M
 *               category:
 *                 type: string
 *                 example: Camiseta
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *        content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *        500:
 *         description: Erro interno do servidor
 */
// GET - /api/products
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos os produtos cadastrados
 *     description: Retorna um array com todos os produtos disponíveis no sistema.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista completa de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     example: "Camiseta Polo"
 *                   quantity:
 *                     type: integer
 *                     example: 10
 *                   price_cents:
 *                     type: integer
 *                     description: Preço em centavos
 *                     example: 4999
 *                   size:
 *                     type: string
 *                     enum: [PP, P, M, G, GG, XG, XGG, EG]
 *                     example: "M"
 *                   gender:
 *                     type: string
 *                     enum: [M, F]
 *                     example: "M"
 *                   category:
 *                     type: string
 *                     example: "Camiseta"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:00:00Z"
 *       500:
 *         description: Erro interno do servidor
 */
router
    .route('/')
    .get(productController.getAllProduct)
    .post(validateProduct(productSchema), productController.createProduct);

//GET - /api/products/search
/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Busca produtos por nome e/ou categoria
 *     description: |
 *       - Filtra por **nome** (busca parcial, case-insensitive usando `LIKE %name%`)
 *       - Filtra por **categoria** (busca exata, case-insensitive)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome ou parte do nome do produto
 *         example: Camiseta Masculina Estampa Adidas
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoria exata do produto
 *         example: Camiseta
 *     responses:
 *       200:
 *         description: Lista de produtos filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     example: "Camiseta Polo"
 *                   quantity:
 *                     type: integer
 *                     example: 10
 *                   price_cents:
 *                     type: integer
 *                     description: Preço em centavos
 *                     example: 4999
 *                   size:
 *                     type: string
 *                     enum: [PP, P, M, G, GG, XG, XGG, EG]
 *                     example: "M"
 *                   gender:
 *                     type: string
 *                     enum: [M, F]
 *                     example: "M"
 *                   category:
 *                     type: string
 *                     example: "Camiseta"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:00:00Z"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *          application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["The search result by name or category was not found."]
 *       500:
 *         description: Erro interno do servidor
 */
router.route('/search').get(productController.searchByNameProduct);

// GET - /api/products/{id}
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     description: Retorna um único produto com base no ID fornecido.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do produto
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: string
 *                   format: uuid
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 name:
 *                   type: string
 *                   example: "Camiseta Polo"
 *                 quantity:
 *                   type: integer
 *                   example: 10
 *                 price_cents:
 *                   type: integer
 *                   description: Preço em centavos
 *                   example: 4999
 *                 size:
 *                   type: string
 *                   enum: [PP, P, M, G, GG, XG, XGG, EG]
 *                   example: "M"
 *                 gender:
 *                   type: string
 *                   enum: [M, F]
 *                   example: "M"
 *                 category:
 *                   type: string
 *                   example: "Roupas Masculinas"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T12:00:00Z"
 *       400:
 *         description: ID inválido ou mal formatado
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["Record with ID {id} not found in table products"]
 *
 *       500:
 *         description: Erro interno do servidor
 */
// PUT - /api/products/{id}
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Products]
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
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Camiseta Polo Atualizada"
 *               quantity:
 *                 type: number
 *                 example: 15
 *               description:
 *                 type: string
 *                 example: "Nova descrição do produto"
 *               price_cents:
 *                 type: number
 *                 example: 5999
 *               size:
 *                 type: string
 *                 enum: [PP, P, M, G, GG, XG, XGG, EG]
 *                 example: G
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 example: M
 *               category:
 *                 type: string
 *                 example: "Camiseta"
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 name:
 *                   type: string
 *                   example: "Camiseta Polo Atualizada"
 *                 quantity:
 *                   type: number
 *                   example: 15
 *                 price_cents:
 *                   type: number
 *                   example: 5999
 *                 size:
 *                   type: string
 *                   example: G
 *                 gender:
 *                   type: string
 *                   example: M
 *                 category:
 *                   type: string
 *                   example: "Camiseta"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["Record with ID {id} not found in table products"]
 *       500:
 *         description: Erro interno do servidor
 */
// DELETE - /api/products{id}
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     description: Exclui permanentemente um produto do sistema.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do produto
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso (conteúdo na resposta)
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation Error"
 *               details: ["Detailed Error Message"]
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details: ["Record with ID {id} not found in table products"]
 *       500:
 *         description: Erro interno do servidor
 */
router
    .route('/:id')
    .get(productController.getByIdProduct)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct);

export default router;
