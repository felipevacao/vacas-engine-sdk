// api/src/routes/index.ts
import express, { Request, Response } from 'express'
import testRoutes from "./test"
import { logging } from '../middlewares/logging'
import { routeNotFound, errorHandler } from '../middlewares/errorHandlers'
import path from 'path';
import fs from 'fs';
import listEndpoints from 'express-list-endpoints';

const router = express.Router()

router.use(logging)

const loadRoutes = async () => {
    const routesDir = path.join(__dirname, '/routes'); // Pasta atual (routes)

    const items = fs.readdirSync(routesDir, { withFileTypes: true });

    for (const item of items) {
        const routeFile = path.join(routesDir, item.name);
        if (fs.existsSync(routeFile)) {
            const routeModule = await import(routeFile);
            const routeName = item.name.replace('.ts', '')
            const routePath = `/${routeName}`; 
            router.use(routePath, routeModule.default); 
        }
    }

    router.get('/', (req: Request, res: Response) => {
        res.send('API Treis está funcionando! ')
    })

    router.use('/test', testRoutes)

    router.get('/test/routes', (req: Request, res: Response) => {
        const endpoints = listEndpoints(router);
        console.log('Rotas registradas:');
        console.table(endpoints);
        res.json(endpoints);
      });

    router.use(routeNotFound)
    router.use(errorHandler)

};

loadRoutes().catch((err) => {
console.error('Erro ao carregar rotas:', err);
});

export default router