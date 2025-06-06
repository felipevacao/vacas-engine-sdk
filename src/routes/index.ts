// api/src/routes/index.ts
import express, { Request, Response } from 'express'
import testRoutes from "./test"
import { logging } from '@middlewares/logging'
import { routeNotFound, errorHandler } from '@middlewares/errorHandlers'
import path from 'path';
import fs from 'fs';
import listEndpoints from 'express-list-endpoints';
import { AuthController } from '@controllers/AuthController';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';

const router = express.Router()
const authController = new AuthController();
const userExpressAdapter = new UserExpressAdapter(authController);


router.use(logging)

// Carrega rotas automaticamente, de acordo com cada entidade
const loadRoutes = async () => {

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

    router.post('/login', userExpressAdapter.login.bind(userExpressAdapter));

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