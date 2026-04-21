import apiClient from './api';
import { formOrchestrator } from './forms/orchestrator';


async function test() {
  console.log('--- Testando Conexão e Autenticação Verona -> Treis ---');

  try {
    console.log('Tentando realizar login...');
    // Credenciais padrão de teste se existirem, ou via env
    const session = await apiClient.login('felipe.trevenzoli@gmail.com', '1234');
    console.log('Login realizado com sucesso!');
    console.log(`Token: ${session.token.substring(0, 15)}...`);
    console.log(`Expira em: ${new Date(session.expiresAt).toLocaleString()}`);

    const entity = 'users';
    console.log(`\nBuscando configuração de formulário para: ${entity}...`);
    const config = await formOrchestrator.getFormConfig(entity);

    if (config.error) {
      console.error('Erro:', config.error);
    } else {
      console.log('Metadados recebidos com sucesso!');
      console.log(`Tabela: ${config.metadata.table}`);
      console.log(`Campos encontrados: ${config.metadata.fields.length}`);
    }
  } catch (error: any) {
    console.error('Falha crítica no teste:', error.message);
  }
}

test().catch(console.error);

