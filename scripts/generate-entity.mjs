// scripts/generate-entity.js
import { writeFileSync, readFileSync } from 'fs';
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

// Função para converter o nome da coluna para camelCase
function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Função para obter a estrutura da tabela
async function getTableStructure(tableName) {
  const columns = await db.raw(`
    SELECT column_name, data_type, is_nullable, column_default
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
function generateEntityFile(tableName, columns) {
  const tableNameCamel = toCamelCase(tableName);
  const tablenameCapital = tableNameCamel.charAt(0).toUpperCase() + tableNameCamel.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'entity.txt'), 'utf-8');
  const entityTemplateContent = (entityTemplate.replaceAll('{{tablenameCapital}}', tablenameCapital)).replaceAll('{{tableNameCamel}}', tableNameCamel);
  const entityContent = `${entityTemplateContent}
    ${columns.map(col => `    ${col.column_name}: ${mapDataType(col.data_type)};`).join('\n')}
  }`;

  const filePath = join(__dirname, '../src/dynamic-modules/entities', `${tableNameCamel}.ts`);
  writeFileSync(filePath, entityContent);
  console.log(`Arquivo de entidade criado: ${filePath}`);
}

// Função para gerar o arquivo de modelo
async function generateModelFile(tableName) {
  const columns = await getTableStructure(tableName);
  const tableNameCamel = toCamelCase(tableName);
  const tablenameCapital = tableNameCamel.charAt(0).toUpperCase() + tableNameCamel.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'model.txt'), 'utf-8');
  const columnNames = columns.map((row) => "'" + row.column_name + "'");
  const columnsString = columnNames.join(', ');
  const modelContent = ((entityTemplate.replaceAll('{{tablenameCapital}}', tablenameCapital)).replaceAll('{{tableNameCamel}}', tableNameCamel)).replaceAll('{{fields}}', columnsString).replaceAll('{{realTableName}}', tableName);
  
  const filePath = join(__dirname, '../src/dynamic-modules/models', `${tableNameCamel}.ts`);
  writeFileSync(filePath, modelContent);
  console.log(`Arquivo de modelo criado: ${filePath}`);
}

// Função para gerar o arquivo de controlador
function generateControllerFile(tableName) {
  const tableNameCamel = toCamelCase(tableName);
  const tablenameCapital = tableNameCamel.charAt(0).toUpperCase() + tableNameCamel.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'controller.txt'), 'utf-8');
  const controllerContent = (entityTemplate.replaceAll('{{tablenameCapital}}', tablenameCapital)).replaceAll('{{tableNameCamel}}', tableNameCamel);

  const filePath = join(__dirname, '../src/dynamic-modules/controllers', `${tableNameCamel}.ts`);
  writeFileSync(filePath, controllerContent);
  console.log(`Arquivo de controlador criado: ${filePath}`);
}

// Função para gerar o arquivo de service
function generateServiceFile(tableName) {
  const tableNameCamel = toCamelCase(tableName);
  const tablenameCapital = tableNameCamel.charAt(0).toUpperCase() + tableNameCamel.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'services.txt'), 'utf-8');
  const controllerContent = (entityTemplate.replaceAll('{{tablenameCapital}}', tablenameCapital)).replaceAll('{{tableNameCamel}}', tableNameCamel);

  const filePath = join(__dirname, '../src/dynamic-modules/services', `${tableNameCamel}.ts`);
  writeFileSync(filePath, controllerContent);
  console.log(`Arquivo de services criado: ${filePath}`);
}


// Função para gerar o arquivo de rotas
function generateRoutesFile(tableName) {
  const tableNameCamel = toCamelCase(tableName);
  const tablenameCapital = tableNameCamel.charAt(0).toUpperCase() + tableNameCamel.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'routes.txt'), 'utf-8');
  const routesContent = (entityTemplate.replaceAll('{{tablenameCapital}}', tablenameCapital)).replaceAll('{{tableNameCamel}}', tableNameCamel);

  const filePath = join(__dirname, '../src/dynamic-modules/routes', `${tableName}.ts`);
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

// Função principal
async function main() {
  try {
    const tableName = await input({ message: 'Qual o nome da tabela?' });
    console.log(tableName)
    const columns = await getTableStructure(tableName);
    console.log('Estrutura da tabela:');
    console.table(columns);
    if(columns.length > 0){
      if(await confirm({ message: 'Criar a Entidade?'}) == true){
        generateEntityFile(tableName, columns);
      }
      if(await confirm({ message: 'Criar o Model?'}) == true){
        await generateModelFile(tableName);
      }
      if(await confirm({ message: 'Criar o Controller?'}) == true){
        generateControllerFile(tableName);
      }
      if(await confirm({  message: 'Criar as Rotas?'}) == true){
        generateRoutesFile(tableName);
      }
      if(await confirm({  message: 'Criar as Services?'}) == true){
        generateServiceFile(tableName);
      }
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