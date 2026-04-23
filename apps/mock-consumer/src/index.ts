import 'dotenv/config';
import { TreisClient, FormOrchestrator, UserSession, FieldMetadata } from '@verona/sdk';

async function mockFrontendRendering(): Promise<void> {
  console.log('--- Iniciando App Consumer (UI Mock) ---');

  // Instanciando Verona com configuração dinâmica
  const verona = new TreisClient({
    baseURL: process.env.MEU_NOVO_PROJETO_API_URL,
    apiKey: process.env.MEU_NOVO_PROJETO_KEY
  });

  const orchestrator = new FormOrchestrator(verona);

  try {
    // 1. O App faz login usando o cliente configurado
    const session: UserSession = await verona.login('felipe.trevenzoli@gmail.com', '1234');
    console.log(`Login realizado! Usuário logado: ${session.token.substring(0, 5)}...`);

    // 2. O App pede a configuração de um formulário
    const formState = await orchestrator.getFormConfig('users');

    if (formState.error) {
      console.error('App UI: Ops! Não foi possível carregar o formulário:', formState.error);
      return;
    }

    // 3. O App "renderiza" a UI com base no metadata
    console.log(`\n[UI] Renderizando formulário para: ${formState.metadata.table.toUpperCase()}`);
    formState.metadata.fields.forEach((field: FieldMetadata) => {
      console.log(`  - Input [${field.formType.toUpperCase()}]: ${field.label} ${field.required ? '*' : ''}`);
    });

    console.log('\n[UI] Formulário pronto para interação do usuário.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Falha crítica no teste:', error.message);
    } else {
      console.error('Falha crítica desconhecida');
    }
  }
}

mockFrontendRendering();
