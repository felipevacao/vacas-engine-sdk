import express, { Request, Response } from 'express'
import eg from "./eg"
import { logging } from '@middlewares/logging'
import { routeNotFound, errorHandler } from '@middlewares/errorHandlers'
import path from 'path';
import fs from 'fs';
import listEndpoints from 'express-list-endpoints';
import authRoutes from './auth';
import env from 'libs/env';
import { MESSAGES } from '@constants/messages/index';

// Route → Adapter → Service (workflow) → Service (entidade) → Controller → Model → Entity → Banco


/**
 * Configuração do roteador principal do Express
 */
const router = express.Router()

if (env.NODE_ENV === 'development') {
    router.use(logging)
}

router.use((req, res, next) => {
    // Prevenir que o token vaze em referrers
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Controlar cache de requisições autenticadas
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    next();
});

/**
 * Função para carregar rotas dinamicamente a partir do diretório `src/dynamic-modules/routes`
 * Ela lê os arquivos de rota, importa os módulos e registra as rotas no roteador principal.
 * Cada arquivo de rota deve exportar um roteador Express como `default` e pode opcionalmente exportar um array de middlewares.
 * O nome do arquivo de rota é usado para definir o caminho da rota (por exemplo, `userSessions.ts` se torna `/userSessions`).
 */
const loadRoutes = async () => {

    const routesDir = path.join(__dirname, '../dynamic-modules/routes');
    const items = fs.readdirSync(routesDir, { withFileTypes: true });
    for (const item of items) {
        const routeFile = path.join(routesDir, item.name);
        if (fs.existsSync(routeFile)) {
            const routeModule = await import(routeFile);
            const routeName = item.name.replace('.ts', '').replace('.js', '')
            const routePath = `/${routeName}`;
            const middleware = routeModule.middleware || [];
            router.use(routePath, middleware, routeModule.default);
        }
    }

    router.get('/', (req: Request, res: Response) => {
        res.send(MESSAGES.API.HOME)
    })

    router.use('/auth', authRoutes)

    // Importa rotas de sistema
    const systemRoutes = await import('./system');
    router.use('/system', systemRoutes.middleware, systemRoutes.default);

    router.use(eg) // Easter Egg Routes

    if (env.NODE_ENV === 'development') {
        /**
         * Rota para listar todas as rotas registradas no roteador principal.
         */
        router.get('/system/routes', systemRoutes.middleware, (req: Request, res: Response) => {
            const endpoints = listEndpoints(router);
            console.log(MESSAGES.ROUTES.LIST);
            console.table(endpoints);
            res.json(endpoints);
        });
    }

    router.use(routeNotFound)
    router.use(errorHandler)

};
loadRoutes().catch((err) => {
    console.error(MESSAGES.ROUTES.ERROR, err);
});

export default router