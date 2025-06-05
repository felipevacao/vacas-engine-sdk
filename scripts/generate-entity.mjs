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

// Função para obter a estrutura da tabela
async function getTableStructure(tableName) {
  const columns = await db.raw(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = ?
    AND column_name NOT IN ('id','created_at','updated_at', 'deleted_at')
    AND table_name NOT IN ('users')
  `, [tableName]);

  return columns.rows;
}

// Função para gerar o arquivo de entidade
function generateEntityFile(tableName, columns) {
  const Tablename = tableName.charAt(0).toUpperCase() + tableName.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'entity.txt'), 'utf-8');
  const entityTemplateContent = (entityTemplate.replaceAll('{{Tablename}}', Tablename)).replaceAll('{{tableName}}', tableName);
  const entityContent = `${entityTemplateContent}
    ${columns.map(col => `    ${col.column_name}: ${mapDataType(col.data_type)};`).join('\n')}
  }`;

  const filePath = join(__dirname, '../src/dynamic-modules/entities', `${tableName}.ts`);
  writeFileSync(filePath, entityContent);
  console.log(`Arquivo de entidade criado: ${filePath}`);
}

// Função para gerar o arquivo de modelo
async function generateModelFile(tableName) {
  const columns = await getTableStructure(tableName);
  const Tablename = tableName.charAt(0).toUpperCase() + tableName.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'model.txt'), 'utf-8');
  const columnNames = columns.map((row) => "'" + row.column_name + "'");
  const columnsString = columnNames.join(', ');
  const modelContent = ((entityTemplate.replaceAll('{{Tablename}}', Tablename)).replaceAll('{{tableName}}', tableName)).replaceAll('{{fields}}', columnsString);
  
  const filePath = join(__dirname, '../src/dynamic-modules/models', `${tableName}.ts`);
  writeFileSync(filePath, modelContent);
  console.log(`Arquivo de modelo criado: ${filePath}`);
}

// Função para gerar o arquivo de controlador
function generateControllerFile(tableName) {
  const Tablename = tableName.charAt(0).toUpperCase() + tableName.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'controller.txt'), 'utf-8');
  const controllerContent = (entityTemplate.replaceAll('{{Tablename}}', Tablename)).replaceAll('{{tableName}}', tableName);

  const filePath = join(__dirname, '../src/dynamic-modules/controllers', `${Tablename}Controller.ts`);
  writeFileSync(filePath, controllerContent);
  console.log(`Arquivo de controlador criado: ${filePath}`);
}


// Função para gerar o arquivo de rotas
function generateRoutesFile(tableName) {
  const Tablename = tableName.charAt(0).toUpperCase() + tableName.slice(1)
  const entityTemplate = readFileSync(join(__dirname, 'routes.txt'), 'utf-8');
  const routesContent = (entityTemplate.replaceAll('{{Tablename}}', Tablename)).replaceAll('{{tableName}}', tableName);

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