import swaggerJsdoc from 'swagger-jsdoc';
import env from '@libs/env';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: `${env.API_NAME} - Documentação`,
			version: env.API_VERSION,
			description: 'Documentação automática para módulos dinâmicos e estáticos',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'Bearer <token>',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [
		'./src/core/routes/*.ts',
		'./src/core/modules/*/routes.ts',
		'./src/core/modules/*/entity.ts',
		'./src/dynamic-modules/*/routes.ts',
		'./src/dynamic-modules/*/entity.ts',
	],
};

export const swaggerSpec = swaggerJsdoc(options);
