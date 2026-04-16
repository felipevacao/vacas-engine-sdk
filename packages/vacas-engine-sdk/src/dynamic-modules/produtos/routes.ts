/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de Produtos
 */

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo registro de Produtos
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produtos'
 *     responses:
 *       201:
 *         description: Criado com sucesso
 *   get:
 *     summary: Lista todos os registros de Produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista retornada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produtos'
 */

/**
 * @swagger
 * /produtos/metadata:
 *   get:
 *     summary: Obtém metadados de Produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Metadados retornados
 */

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Obtém um registro de Produtos pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro encontrado
 *   patch:
 *     summary: Atualiza um registro de Produtos
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produtos'
 *     responses:
 *       200:
 *         description: Registro atualizado
 *   delete:
 *     summary: Marca um registro de Produtos como deletado
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro removido
 */

// Gerado automáticamente
import express from 'express';
import { produtosService } from './service';
import { ExpressAdapter } from '@adapters/express.adapter';
import { tokenMiddleware } from '@middlewares/token';

const router = express.Router();
const ProdutosService = new produtosService();
const expressAdapter = new ExpressAdapter(ProdutosService);

// C
router.post('/', expressAdapter.create.bind(expressAdapter));

// R
router.get('/metadata', expressAdapter.metadata.bind(expressAdapter))
router.get('/search', expressAdapter.findBy.bind(expressAdapter))
router.get('/', expressAdapter.findAll.bind(expressAdapter));
router.get('/:id', expressAdapter.findById.bind(expressAdapter));

// U
router.put('/:id', expressAdapter.update.bind(expressAdapter));

// D
router.delete('/:id', expressAdapter.delete.bind(expressAdapter));
router.delete('/force/:id', expressAdapter.forceDelete.bind(expressAdapter));

export const middleware = [tokenMiddleware];
export default router;