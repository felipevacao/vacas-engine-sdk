// scripts/generate-entity.js
import { writeFileSync } from 'fs';
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
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
},
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para obter a estrutura da tabela
async function getTableStructure(tableName) {
const columns = await db.raw(`
  SELECT column_name, data_type, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_name = ?
  AND column_name NOT IN ('id','created_at','updated_at')
`, [tableName]);

return columns.rows;
}

// Função para gerar o arquivo de entidade
function generateEntityFile(tableName, columns) {
const Tablename = tableName.charAt(0).toUpperCase() + tableName.slice(1)
const entityContent = `
import { BaseEntity } from '../entity';

export interface ${Tablename}Entity extends BaseEntity {
${columns.map(col => `    ${col.column_name}: ${mapDataType(col.data_type)};`).join('\n')}
}
`;

const filePath = join(__dirname, '../src/types/entities', `${tableName}.ts`);
writeFileSync(filePath, entityContent);
console.log(`Arquivo de entidade criado: ${filePath}`);
}

// Função para gerar o arquivo de modelo
function generateModelFile(tableName) {
const Tablename = tableName.charAt(0).toUpperCase() + tableName.slice(1)
const modelContent = `
import { ${Tablename}Entity } from '../types/entities/${tableName}';
import * as baseService from '../services/baseServices';
import { Model } from '../types/entity';

const ${Tablename}Model: Model<${Tablename}Entity> = {
  create: baseService.create<${Tablename}Entity>('${tableName}'),
  findAll: baseService.read<${Tablename}Entity>('${tableName}').findAll,
  findById: baseService.read<${Tablename}Entity>('${tableName}').findById,
  findBy: baseService.read<${Tablename}Entity>('${tableName}').findBy,
};

export default ${Tablename}Model;
`;

const filePath = join(__dirname, '../src/models', `${tableName}.ts`);
writeFileSync(filePath, modelContent);
console.log(`Arquivo de modelo criado: ${filePath}`);
}

// Função para gerar o arquivo de controlador
function generateControllerFile(tableName) {
const Tablename = tableName.charAt(0).toUpperCase() + tableName.slice(1)
const controllerContent = `
import { BaseController } from '../controllers/baseController';
import ${Tablename}Model from '../models/${tableName}';
import { ${Tablename}Entity } from '../types/entities/${tableName}';

export class ${Tablename}Controller extends BaseController<${Tablename}Entity> {
  constructor() {
      super(${Tablename}Model);
  }
}
`;

const filePath = join(__dirname, '../src/controllers', `${tableName}Controller.ts`);
writeFileSync(filePath, controllerContent);
console.log(`Arquivo de controlador criado: ${filePath}`);
}


// Função para gerar o arquivo de rotas
function generateRoutesFile(tableName) {
const Tablename = tableName.charAt(0).toUpperCase() + tableName.slice(1)
const routesContent = `
import express from 'express';
import { ${Tablename}Controller } from '../../controllers/${tableName}Controller';

const router = express.Router();
const ${tableName.toLowerCase()}Controller = new ${Tablename}Controller();

router.post('/', ${tableName.toLowerCase()}Controller.create.bind(${tableName.toLowerCase()}Controller));
router.get('/', ${tableName.toLowerCase()}Controller.findAll.bind(${tableName.toLowerCase()}Controller));
router.get('/:id', ${tableName.toLowerCase()}Controller.findById.bind(${tableName.toLowerCase()}Controller));

export default router;
`;

const filePath = join(__dirname, '../src/routes/routes', `${tableName}.ts`);
writeFileSync(filePath, routesContent);
console.log(`Arquivo de rotas criado: ${filePath}`);
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
    return 'string';
  case 'boolean':
    return 'boolean';
  case 'timestamp':
  case 'date':
    return 'Date';
  default:
    return 'any';
}
}

// Função principal
async function main() {
try {
  const tableName = await input({ message: 'Qual o nome da tabela?' });
  console.log(tableName)
  const columns = await getTableStructure(tableName);
  console.log('Estrutura da tabela:');
  console.table(columns);
  
  if(await confirm({ message: 'Criar a Entidade?'}) == true){
    generateEntityFile(tableName, columns);
  }
  if(await confirm({ message: 'Criar o Model?'}) == true){
    generateModelFile(tableName);
  }
  if(await confirm({ message: 'Criar o Controller?'}) == true){
    generateControllerFile(tableName);
  }
  if(await confirm({  message: 'Criar as Rotas?'}) == true){
    generateRoutesFile(tableName);
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

main();