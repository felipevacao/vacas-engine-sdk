// api/src/routes/index.ts
import express, { Request, Response } from 'express'
import testRoutes from "./test"
import { logging } from '../middlewares/logging'
import { routeNotFound, errorHandler } from '../middlewares/errorHandlers'

const router = express.Router()

router.use(logging)

router.use('/test', testRoutes)
  
router.get('/', (req: Request, res: Response) => {
    res.send('API Treis está funcionando! ')
})

router.use(routeNotFound)
router.use(errorHandler)

export default router