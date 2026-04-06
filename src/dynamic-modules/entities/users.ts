/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         login:
 *           type: string
 */

// Gerado automáticamente
import { BaseEntity, UserStatus, UserRole } from '@app-types/entity'

export interface UsersEntity extends BaseEntity {
    name: string
    email: string
    login: string
    password: string
    role: UserRole
    status: UserStatus
    pepper: string
}