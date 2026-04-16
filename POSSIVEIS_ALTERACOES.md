# Possíveis Alterações e Melhorias - Treis API (Vacas-Engine)

Este documento lista funcionalidades de infraestrutura de alto nível para transformar o CRUD genérico do Treis em uma "Engine" robusta e escalável.

## 1. Camada de Inteligência de Dados
*   **Soft Deletes com Restauração Cascata:** Implementar lógica para marcar registros como deletados e permitir a restauração recursiva de relacionamentos (ex: ao restaurar um Cliente, restaurar opcionalmente seus Pedidos deletados no mesmo evento).
*   **Histórico de Versão (Snapshotting):** Criar uma tabela de auditoria que armazena o JSON do estado anterior a cada `update`, permitindo funcionalidade de "Rollback" e rastreabilidade total de alterações de valores.
*   **Campos Calculados Virtuais:** Permitir a definição de getters no Model que são resolvidos dinamicamente pela API (ex: `total_vendas`, `status_faturamento`) sem persistência no banco.

## 2. Controle e Segurança Avançados
*   **Controle de Acesso por Atributo (ABAC):** Evoluir o RBAC atual para permitir regras baseadas em contexto (ex: "Usuário X só edita Pedidos se status for 'Pendente'").
*   **Mascaramento de Dados Dinâmico:** Implementar um middleware que mascara dados sensíveis (ex: `***.456.***-00`) com base no nível de privilégio do usuário logado.
*   **Data Pinning / Imutabilidade Temporal:** Funcionalidade para "trancar" registros de períodos retroativos, impedindo qualquer alteração (essencial para módulos contábeis/fiscais).

## 3. Integração e Extensibilidade
*   **Webhooks Nativos por Evento:** Sistema de disparo de notificações HTTP (POST) para URLs externas sempre que ocorrer um evento de ciclo de vida (Created, Updated, Deleted) em entidades específicas.
*   **Bulk Operations (Transação Única):** Endpoint especializado para processar milhares de registros em um único lote (Batch), garantindo atomicidade total via transação de banco.
*   **Inclusão em Lote:** Implementar suporte para inserção massiva de dados (Bulk Insert) otimizada para alto volume, com validação de esquema unificada.
*   **Ajuste do Metadata:** Refatorar a camada de Metadata para suportar metadados contextuais, dinâmicos e cache otimizado para reduzir carga no banco.
*   **Exportação Polimórfica:** Gerador de arquivos integrado que permite converter o resultado de qualquer consulta CRUD para formatos como CSV, Excel, PDF ou JSON.

## 4. Performance e UX da API
*   **Refinamento de Sparse Fieldsets:** Ajustar a implementação atual para que o parâmetro `?fields=` possa substituir completamente os campos padrão, em vez de apenas adicionar campos extras.
*   **Busca Global (Full-Text Search):** Implementar um motor de busca otimizado que varre múltiplas colunas de texto de uma entidade usando índices de busca do Postgres/MySQL.
*   **Cursor-based Pagination:** Substituir (ou complementar) a paginação por `offset/limit` por paginação baseada em cursor (ex: `next_cursor`), garantindo performance estável em tabelas com milhões de linhas.

## 5. Auditoria e Diagnóstico
*   **Traceability de Origem:** Registrar metadados sobre a origem da requisição (App ID, IP, User Agent) em cada operação de escrita.
*   **Dry Run (Modo Simulação):** Adicionar suporte ao header `X-Dry-Run` que executa toda a lógica de negócio, validações e regras, mas faz um Rollback forçado no banco e retorna o resultado que *seria* gravado.
