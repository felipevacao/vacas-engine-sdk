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
            const session = await this.service.login(login, password)
            if(session){
                res.status(201).json(session)
            } else {
                res.status(401).json(this.handleError('Invalid login or password'))
            }
        } catch (error) {
            res.status(400).json(this.handleError('Erro ao verificar Login', error as Error))
        }

    }
}