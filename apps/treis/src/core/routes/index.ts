import { routeNotFound, errorHandler, logging } from '@middlewares'
import express, { Request, Response } from 'express'
import eg from "./eg"
import path from 'path';
import fs from 'fs';
import listEndpoints from 'express-list-endpoints';
import authRoutes from './auth';
import reportRoutes from './report'; // Adicionado
import env from '@libs/env';
import { MESSAGES } from '@constants';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@utils';

// Route → Adapter → Service (workflow) → Service (entidade) → Controller → Model → Entity → Banco


/**
 * Configuração do roteador principal do Express
 */
const router = express.Router()

if (env.NODE_ENV === 'development') {
    router.use(logging)

    /**
     * Configuração da documentação da API (Swagger)
     */
    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

}

router.use((req, res, next) => {
    // Prevenir que o token vaze em referrers
    // res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Controlar cache de requisições autenticadas
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    next();
});

/**
 * Função para carregar rotas dinamicamente a partir de múltiplos diretórios.
 * Ela lê os arquivos de rota, importa os módulos e registra as rotas no roteador principal.
 */
const loadRoutes = async () => {
    const isDist = __dirname.includes('dist');

    // 1. Carrega módulos padrão do Core (ex: users)
    const coreModulesDir = path.join(__dirname, '../modules');
    if (fs.existsSync(coreModulesDir)) {
        const modules = fs.readdirSync(coreModulesDir);
        for (const moduleName of modules) {
            const routesPath = path.join(coreModulesDir, moduleName, `routes.${isDist ? 'js' : 'ts'}`);
            if (fs.existsSync(routesPath)) {
                const routeModule = await import(routesPath);
                const routePath = `/${moduleName}`;
                const middleware = routeModule.middleware || [];
                router.use(routePath, middleware, routeModule.default);
            }
        }
    }

    // 2. Carrega módulos dinâmicos específicos do projeto (Plug & Play)
    const dynamicModulesDir = path.join(__dirname, '../../dynamic-modules');
    if (fs.existsSync(dynamicModulesDir)) {
        const items = fs.readdirSync(dynamicModulesDir, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) {
                // Padrão novo: src/dynamic-modules/[modulo]/routes.ts
                const moduleRoutesPath = path.join(dynamicModulesDir, item.name, `routes.${isDist ? 'js' : 'ts'}`);
                if (fs.existsSync(moduleRoutesPath)) {
                    const routeModule = await import(moduleRoutesPath);
                    const routePath = `/${item.name}`;
                    const middleware = routeModule.middleware || [];
                    router.use(routePath, middleware, routeModule.default);
                    console.log(`[INFO] [Routes] Módulo dinâmico carregado: ${item.name}`);
                }
            }
        }

        // Mantém suporte para a estrutura legada: /dynamic-modules/routes/*.ts
        const legacyRoutesDir = path.join(dynamicModulesDir, 'routes');
        if (fs.existsSync(legacyRoutesDir)) {
            const legacyFiles = fs.readdirSync(legacyRoutesDir);
            for (const file of legacyFiles) {
                if (file.endsWith('.ts') || file.endsWith('.js')) {
                    const routeFile = path.join(legacyRoutesDir, file);
                    const routeModule = await import(routeFile);
                    const routeName = file.replace('.ts', '').replace('.js', '')
                    const routePath = `/${routeName}`;
                    const middleware = routeModule.middleware || [];
                    router.use(routePath, middleware, routeModule.default);
                }
            }
        }
    }

    router.get('/', (req: Request, res: Response) => {
        res.send(MESSAGES.API.HOME)
    })

    router.use('/auth', authRoutes)
    router.use('/api/reports', reportRoutes); // Adicionado

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