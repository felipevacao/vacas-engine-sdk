// api/src/routes/index.ts
import express, { Request, Response } from 'express'
import testRoutes from "./test"
import eg from "./eg"
import { logging } from '@middlewares/logging'
import { routeNotFound, errorHandler } from '@middlewares/errorHandlers'
import path from 'path';
import fs from 'fs';
import listEndpoints from 'express-list-endpoints';
import authRoutes from './auth';


const router = express.Router()

router.use(logging)


// Carrega rotas automaticamente, de acordo com cada entidade
const loadRoutes = async () => {

    // load routes from dynamic modules
    const routesDir = path.join(__dirname, '../dynamic-modules/routes'); 
    const items = fs.readdirSync(routesDir, { withFileTypes: true });
    for (const item of items) {
        const routeFile = path.join(routesDir, item.name);
        if (fs.existsSync(routeFile)) {
            const routeModule = await import(routeFile);
            const routeName = item.name.replace('.ts', '').replace('.js','')
            const routePath = `/${routeName}`; 
            const middleware = routeModule.middleware || [];
            router.use(routePath, middleware, routeModule.default); 
        }
    }

    router.get('/', (req: Request, res: Response) => {
        res.send('API Treis está funcionando! ')
    })

    router.use('/auth', authRoutes)

    router.use('/test', testRoutes)
    router.use(eg)

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