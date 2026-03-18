// scripts/generate-entity.js
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname  } from 'path';
import { fileURLToPath } from 'url';
import { input, confirm } from '@inquirer/prompts';
import "dotenv/config";
import knex from 'knex';

const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
	},
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __pathToSave = 'dynamic-modules/';

// Função principal
async function main() {
	try {
		const tableName = await input({ message: 'Qual o nome da tabela?' });
		const columns = await getTableStructure(tableName);
		if (columns.length > 0) {
			console.log('Estrutura da tabela:');
			console.table(columns);
			const tableNameCamel = toCamelCase(tableName);
			const tablenameCapital = tableNameCamel.charAt(0).toUpperCase() + tableNameCamel.slice(1)
			if(await confirm({ message: 'Criar a Entidade?'}) == true){
				generateEntityFile(columns, tableNameCamel, tablenameCapital);
			}
			if(await confirm({ message: 'Criar o Model?'}) == true){
				await generateModelFile(tableName, tableNameCamel, tablenameCapital);
			}
			if(await confirm({ message: 'Criar o Controller?'}) == true){
				generateControllerFile(tableNameCamel, tablenameCapital);
			}
			if(await confirm({  message: 'Criar as Rotas?'}) == true){
				generateRoutesFile(tableNameCamel, tablenameCapital);
			}
			if(await confirm({  message: 'Criar as Services?'}) == true){
				generateServiceFile(tableNameCamel, tablenameCapital);
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

// Função para gerar o arquivo de entidade
function generateEntityFile(columns, tableNameCamel, tablenameCapital) {
	
	const entityTemplateContent = getContent('entity.txt', tableNameCamel, tablenameCapital);
	const entityContent = `${entityTemplateContent}
		${columns.map(col => `    ${col.column_name}: ${mapDataType(col.data_type)};`).join('\n')}
	}`;
	const filePath = join(__dirname, __pathToSave + 'entities', `${tableNameCamel}.ts`);
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, entityContent);
	console.log(`Arquivo de Entidade criado em: ${filePath}`);

}

// Função para gerar o arquivo de modelo
async function generateModelFile(tableName, tableNameCamel, tablenameCapital) {
	const columns = await getTableStructure(tableName);
	const columnNames = columns.map((row) => "'" + row.column_name + "'");
	const columnsString = columnNames.join(', ');
	const modelContent = (getContent('model.txt', tableNameCamel, tablenameCapital)).replaceAll('{{fields}}', columnsString).replaceAll('{{realTableName}}', tableName);
	
	const filePath = join(__dirname, __pathToSave + 'models', `${tableNameCamel}.ts`);
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, modelContent);
	console.log(`Arquivo de Modelo criado em: ${filePath}`);
}

// Função para gerar o arquivo de controlador
function generateControllerFile(tableNameCamel, tablenameCapital) {
	const controllerContent = getContent('controller.txt', tableNameCamel, tablenameCapital);

	const filePath = join(__dirname, __pathToSave + 'controllers', `${tableNameCamel}.ts`);
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, controllerContent);
	console.log(`Arquivo de Controlador criado em: ${filePath}`);
}

// Função para gerar o arquivo de service
function generateServiceFile(tableNameCamel, tablenameCapital) {
	const controllerContent = getContent('services.txt', tableNameCamel, tablenameCapital);

	const filePath = join(__dirname, __pathToSave + 'services', `${tableNameCamel}.ts`);
	ensureDirectoryExistence(filePath);
	writeFileSync(filePath, controllerContent);
	console.log(`Arquivo de Services criado em: ${filePath}`);
}


	// Função para gerar o arquivo de rotas
function generateRoutesFile(tableNameCamel, tablenameCapital) {
	const routesContent = getContent('routes.txt', tableNameCamel, tablenameCapital);

	const filePath = join(__dirname, __pathToSave + 'routes', `${tableNameCamel}.ts`);
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
			return 'any';
	}
}

main();