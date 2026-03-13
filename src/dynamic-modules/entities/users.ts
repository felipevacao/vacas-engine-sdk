// Gerado automáticamente
import { BaseEntity, UserStatus, UserRole } from 'types/entity'

export interface UsersEntity extends BaseEntity {
    name: string
    email: string
    login: string
    password: string
    role: UserRole
    status: UserStatus
    pepper: string
}