import { Request, Response, NextFunction, RequestHandler } from 'express';

export type AsyncHandlerFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown;

/**
 * Wrapper para capturar erros em funções assíncronas do Express.
 * Resolve o problema de ter que usar try-catch em cada controller/adapter.
 */
export const asyncHandler = (fn: AsyncHandlerFn): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
