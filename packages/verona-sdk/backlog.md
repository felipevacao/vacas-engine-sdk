# Backlog do Verona SDK

Este documento rastreia as tarefas pendentes e funcionalidades futuras para o Verona SDK, garantindo que ele acompanhe a evolução do motor Treis.

## Prioridades (Tópico 1 - Inteligência de Dados)
- [ ] **Integração de Histórico de Auditoria:**
  - Implementar método `getAuditLogs(entity, entityId)` no `MetadataService` ou `Orchestrator` para consumir os logs da tabela `vacas_audit_logs`.
  - Criar interface `AuditLog` no SDK para tipar a resposta do histórico (data, autor, ação, snapshot).
- [ ] **Gerenciamento de Soft Deletes:**
  - Adicionar suporte a `restore(entity, id)` no `FormOrchestrator` do SDK.
  - Adicionar flag `isDeleted` nos metadados retornados para habilitar visualização de itens na lixeira.
- [ ] **Aprimoramento de Metadata Dinâmico:**
  - Implementar cache de metadados no lado do cliente para reduzir chamadas desnecessárias ao backend.

## Funcionalidades Futuras
- [ ] **Suporte a Data Pinning:**
  - Adicionar verificação de estado imutável nos metadados para bloquear edição de registros fiscais/contábeis antigos.
- [ ] **UI Kit React:**
  - Implementar o `@verona/ui-react` seguindo o padrão de design estabelecido no `@verona/ui-vue`.
- [ ] **VAsyncSelect:**
  - Componente de seleção com busca assíncrona (lazy loading) para relacionamentos com muitos registros.
