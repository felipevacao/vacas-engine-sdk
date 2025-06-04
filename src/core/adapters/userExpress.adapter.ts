import { Request, Response } from 'express';
import { ExpressAdapter } from "@adapters/express.adapter"
import { UsersController } from "@core/controllers/UsersController"
import { UsersEntity } from "@core/entities/users"
import { LoginRequest } from "types/entity"


export class UserExpressAdapter extends ExpressAdapter<UsersEntity> {
    constructor(protected service: UsersController) {
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

            if(await this.service.verifyUserPassword(login, password)){
                res.status(201).json('Login efetuado com sucesso')
            } else {
                res.status(401).json(this.handleError('Invalid login or password'))
            }
        } catch (error) {
            res.status(400).json(this.handleError('Erro ao verificar Login', error as Error))
        }

    }
}