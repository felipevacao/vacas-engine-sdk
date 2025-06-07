// api/src/middlewares/logging.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log incoming requests.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
export const logging = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();

};