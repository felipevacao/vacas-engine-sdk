import { Request, Response } from 'express';
import { ExpressAdapter } from "@adapters/express.adapter"
import { AuthController } from "@controllers/AuthController"
import { UsersEntity } from "@dynamic-modules/entities/users"
import { LoginRequest } from "types/entity"


export class UserExpressAdapter extends ExpressAdapter<UsersEntity> {
    constructor(protected service: AuthController) {
        super(service)
    }

    private validateLoginFields(input: unknown): [string, string] {
        if(!input || typeof input !== 'object') {
            throw new Error('Invalid input')
        }
        const { email, password } = input as LoginRequest
        if(!email || !password) {
            throw new Error('Invalid input')
        }
        
        return [ email, password ]
    }
    
    async login(req: Request, res: Response): Promise<void> {
        try {
            const [login, password] = this.validateLoginFields(req.body)
            const session = await this.service.login(login, password, '127.0.0.1')
            
            if(!session){
                res.status(401).json(this.handleError('Invalid login or password'))
            }
            
            res.status(201).json(session)
        } catch (error) {
            res.status(400).json(this.handleError('Erro ao verificar Login', error as Error))
        }

    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            if (!req.session) {
                throw new Error('No active session')
            }
            await this.service.logout(req.session.id)

            res.status(200).json({ message: 'Logout realizado com sucesso' })
        } catch (error) {
            res.status(400).json(this.handleError('Erro ao realizar o Logout', error as Error))
        }

    }}