import { Request, Response, NextFunction } from 'express';

export const testMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Middleware de teste foi executado');
    next();
}