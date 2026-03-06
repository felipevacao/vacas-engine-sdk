// api/src/middlewares/enableRoute.ts
import env from "@lib/env"
import { Request, Response, NextFunction } from 'express'
import { notFound } from "./errorHandlers"

export const enableTestRoute = (
	req: Request,
	res: Response,
	next: NextFunction
) => {

	if (!env.ENABLE_TEST_ROUTES) {
		notFound(res)
	} else {
		next()
	}

}
