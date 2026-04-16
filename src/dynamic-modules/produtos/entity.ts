/**
 * @swagger
 * components:
 *   schemas:
 *     Produtos:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         produto:
 *           type: string
 */

// Gerado automáticamente
import { BaseEntity } from '@app-types/entity';

export interface produtosEntity extends BaseEntity {

		    produto: string;
	}