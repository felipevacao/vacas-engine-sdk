import { Request, Response, NextFunction } from 'express'
export const tokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
}