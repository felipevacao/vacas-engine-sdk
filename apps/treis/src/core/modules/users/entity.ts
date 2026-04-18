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
import { UserStatus, UserRole } from '@app-types'
import { BaseEntity } from "@interfaces";

export interface UsersEntity extends BaseEntity {
    name: string
    email: string
    login: string
    password: string
    role: UserRole
    status: UserStatus
    pepper: string
}