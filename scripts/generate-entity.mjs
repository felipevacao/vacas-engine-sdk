// scripts/generate-entity.js
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { input, confirm } from '@inquirer/prompts';
import "dotenv/config";
import knex from 'knex';

const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DB_HOST_LOCAL || 'localhost',
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
	},
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __pathToSave = '../src/dynamic-modules/';

// Função principal
async function main() {
	try {
		const tableName = await input({ message: 'Qual o nome da tabela?' });
		const columns = await getTableStructure(tableName);
		if (columns.length > 0) {
			console.log('Estrutura da tabela:');
			console.table(columns);

			// Detectar relações automaticamente
			const autoRelations = await getTableRelations(tableName);
			if (autoRelations.length > 0) {
				console.log('Relações detectadas automaticamente:');
				console.table(autoRelations);
			}

			let relations = [...autoRelations];
			while (await confirm({ message: 'Deseja adicionar mais alguma relação manualmente?', default: false }) == true) {
				const name = await input({ message: 'Nome da relação (ex: itens, mesa):' });
				const type = await input({ message: 'Tipo (belongsTo, hasMany, hasOne):', default: 'belongsTo' });
				const table = await input({ message: 'Tabela relacionada:' });
				const localKey = await input({ message: 'Chave local (ex: id_mesa ou id):' });
				const foreignKey = await input({ message: 'Chave estrangeira (ex: id ou id_comanda):' });

				relations.push({ name, type, table, localKey, foreignKey });
			}

			const tableNameCamel = toCamelCase(tableName);
			const tablenameCapital = tableNameCamel.charAt(0).toUpperCase() + tableNameCamel.slice(1)

			if (await confirm({ message: 'Criar a Entidade?' }) == true) {
				generateEntityFile(columns, tableNameCamel, tablenameCapital);
			}
			if (await confirm({ message: 'Criar o Model?' }) == true) {
				await generateModelFile(tableName, tableNameCamel, tablenameCapital, relations);
			}
			if (await confirm({ message: 'Criar o Controller?' }) == true) {
				generateControllerFile(tableNameCamel, tablenameCapital);
			}
			if (await confirm({ message: 'Criar as Services?' }) == true) {
				generateServiceFile(tableName, tableNameCamel, tablenameCapital);
			}
			if (await confirm({ message: 'Criar as Rotas?' }) == true) {
				generateRoutesFile(tableNameCamel, tablenameCapital);
			}
			if (await confirm({ message: 'Criar o Proto?' }) == true) {
				generateProtoFile(tableNameCamel, tablenameCapital);
			}
			if (await confirm({ message: 'Criar o Grpc Adapter?' }) == true) {
				generateGrpcAdapterFile(tableNameCamel, tablenameCapital);
			}
		} else {
			console.log('Tabela não existe ou não permitida!');
		}
	} catch (error) {
		console.error('Erro durante a execução do script:', error);
	} finally {

		await db.destroy();
		console.log('Conexão com o banco de dados encerrada.');
		console.log('Processo Finalizado.');

		process.exit(0);
	}
}

// Função para garantir que a pasta existe
function ensureDirectoryExistence(filePath) {
	const dir = dirname(filePath);
	try {
		mkdirSync(dir, { recursive: true });
	} catch (error) {
		if (error.code !== 'EEXIST') {
			throw error;
		}
	}
}

// Função para converter o nome da coluna para camelCase
function toCamelCase(str) {
	return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Função pra pegar o conteudo do arquivo e já alterar os valores para a entidade
function getContent(file, tablenameCapital, tableNameCamel) {
	const entityTemplate = readFileSync(join(__dirname, 'base', file), 'utf-8');
	return (entityTemplate.replaceAll('{{tablenameCapital}}', tablenameCapital)).replaceAll('{{tableNameCamel}}', tableNameCamel)
}

// Função para obter a estrutura da tabela
async function getTableStructure(tableName) {
	const columns = await db.raw(`
		SELECT 
			column_name, 
			data_type, 
			is_nullable, 
			column_default
		FROM information_schema.columns
			WHERE table_name = ?
				AND column_name NOT IN ('id','created_at','updated_at', 'deleted_at')
				AND table_name NOT IN ('users')
	`, [tableName]);

	const rows = columns.rows.map(col => {
		return {
			column_name: toCamelCase(col.column_name),
			data_type: col.data_type,
			converted_type: mapDataType(col.data_type),
			is_nullable: col.is_nullable,
			column_default: col.column_default
		}
	})
	return rows;
}

// Função para obter as relações (Foreign Keys)
async function getTableRelations(tableName) {
	const result = await db.raw(`
        SELECT
            kcu.column_name as local_column, 
            ccu.table_name AS foreign_table,
            ccu.column_name AS foreign_column 
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = ?;
    `, [tableName]);

	return result.rows.map(rel => ({
		name: rel.local_column.replace(/_id$|^id_/, ''), // Tenta dar um nome amigável
		type: 'belongsTo',
		table: rel.foreign_table,
		localKey: toCamelCase(rel.local_column),
		foreignKey: toCamelCase(rel.foreign_column)
	}));
}

// Função para gerar o arquivo de entidade
function generateEntityFile(columns, tableNameCamel, tablenameCapital) {

	const swaggerProperties = columns.map(col => {
		const type = col.converted_type === 'number' ? 'integer' : col.converted_type.toLowerCase();
		return ` *         ${col.column_name}:
 *           type: ${type}`;
	}).join('\n');

	const swaggerBlock = `/**
 * @swagger
 * components:
 *   schemas:
 *     ${tablenameCapital}:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
${swaggerProperties}
 */

`;

	const entityTemplateContent = getContent('entity.txt', tableNameCamel, tablenameCapital);
	const entityContent = `${swaggerBlock}${entityTemplateContent}
		${columns.map(col => `    ${col.column_name}: ${mapDataType(col.data_type)};`).join('\n')}
	}`;
	const filePath = join(__dirname, __pathToSave, tableNameCamel, 'entity.ts');
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, entityContent);
	console.log(`Arquivo de Entidade criado em: ${filePath}`);

}

// Função para gerar o arquivo de modelo
async function generateModelFile(tableName, tableNameCamel, tablenameCapital, relations = []) {
	const columns = await getTableStructure(tableName);
	const columnNames = columns.map((row) => "'" + row.column_name + "'");
	const columnsString = columnNames.join(', ');

	const relationsString = relations.map(rel => {
		return `
    ${rel.name}: {
      type: '${rel.type}',
      table: '${rel.table}',
      localKey: '${rel.localKey}',
      foreignKey: '${rel.foreignKey}'
    }`;
	}).join(',');

	const modelContent = (getContent('model.txt', tableNameCamel, tablenameCapital))
		.replaceAll('{{fields}}', columnsString)
		.replaceAll('{{realTableName}}', tableName)
		.replaceAll('{{relations}}', relationsString);

	const filePath = join(__dirname, __pathToSave, tableNameCamel, 'model.ts');
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, modelContent);
	console.log(`Arquivo de Modelo criado em: ${filePath}`);
}

// Função para gerar o arquivo de controlador
function generateControllerFile(tableNameCamel, tablenameCapital) {
	const controllerContent = getContent('controller.txt', tableNameCamel, tablenameCapital);

	const filePath = join(__dirname, __pathToSave, tableNameCamel, 'controller.ts');
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, controllerContent);
	console.log(`Arquivo de Controlador criado em: ${filePath}`);
}

// Função para gerar o arquivo de service
function generateServiceFile(tableName, tableNameCamel, tablenameCapital) {
	const controllerContent = getContent('services.txt', tableNameCamel, tablenameCapital)
		.replaceAll('{{realTableName}}', tableName);

	const filePath = join(__dirname, __pathToSave, tableNameCamel, 'service.ts');
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, controllerContent);
	console.log(`Arquivo de Services criado em: ${filePath}`);
}

// Função para gerar o arquivo proto
function generateProtoFile(tableNameCamel, tablenameCapital) {
	const protoContent = getContent('proto.txt', tableNameCamel, tablenameCapital);

	const filePath = join(__dirname, __pathToSave, tableNameCamel, `${tableNameCamel}.proto`);
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, protoContent);
	console.log(`Arquivo Proto criado em: ${filePath}`);
}

// Função para gerar o arquivo de adaptador gRPC
function generateGrpcAdapterFile(tableNameCamel, tablenameCapital) {
	const adapterContent = getContent('grpc-adapter.txt', tableNameCamel, tablenameCapital);

	const filePath = join(__dirname, __pathToSave, tableNameCamel, 'grpc.adapter.ts');
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, adapterContent);
	console.log(`Arquivo de gRPC Adapter criado em: ${filePath}`);
}


// Função para gerar o arquivo de rotas
function generateRoutesFile(tableNameCamel, tablenameCapital) {
	const swaggerRoutes = `/**
 * @swagger
 * tags:
 *   name: ${tablenameCapital}
 *   description: Gerenciamento de ${tablenameCapital}
 */

/**
 * @swagger
 * /${tableNameCamel}:
 *   post:
 *     summary: Cria um novo registro de ${tablenameCapital}
 *     tags: [${tablenameCapital}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${tablenameCapital}'
 *     responses:
 *       201:
 *         description: Criado com sucesso
 *   get:
 *     summary: Lista todos os registros de ${tablenameCapital}
 *     tags: [${tablenameCapital}]
 *     responses:
 *       200:
 *         description: Lista retornada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/${tablenameCapital}'
 */

/**
 * @swagger
 * /${tableNameCamel}/metadata:
 *   get:
 *     summary: Obtém metadados de ${tablenameCapital}
 *     tags: [${tablenameCapital}]
 *     responses:
 *       200:
 *         description: Metadados retornados
 */

/**
 * @swagger
 * /${tableNameCamel}/{id}:
 *   get:
 *     summary: Obtém um registro de ${tablenameCapital} pelo ID
 *     tags: [${tablenameCapital}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro encontrado
 *   patch:
 *     summary: Atualiza um registro de ${tablenameCapital}
 *     tags: [${tablenameCapital}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${tablenameCapital}'
 *     responses:
 *       200:
 *         description: Registro atualizado
 *   delete:
 *     summary: Marca um registro de ${tablenameCapital} como deletado
 *     tags: [${tablenameCapital}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro removido
 */

`;
	const routesContent = swaggerRoutes + getContent('routes.txt', tableNameCamel, tablenameCapital);

	const filePath = join(__dirname, __pathToSave, tableNameCamel, 'routes.ts');
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, routesContent);
	console.log(`Arquivo de Rotas criado em: ${filePath}`);
}

// Mapear tipos de dados do PostgreSQL para TypeScript
function mapDataType(dataType) {
	switch (dataType) {
		case 'integer':
		case 'numeric':
		case 'bigint':
		case 'smallint':
			return 'number';
		case 'text':
		case 'varchar':
		case 'character varying':
		case 'char':
		case 'uuid':
			return 'string';
		case 'boolean':
			return 'boolean';
		case 'timestamp':
		case 'date':
		case 'timestamp with time zone':
		case 'timestamp without time zone':
			return 'Date';
		default:
			return 'undefined';
	}
}

main();