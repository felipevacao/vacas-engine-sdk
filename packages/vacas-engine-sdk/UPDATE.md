# 📝 Registro de Atualizações - Vacas-Engine SDK

Este arquivo registra todas as melhorias, correções e novos recursos adicionados ao SDK para o usuário final.

---

## [1.3.3] - 2026-04-18

### ✨ Novidades: Operações Bulk (Massa)

- **Operações Bulk Atômicas**: Implementado suporte de ponta a ponta para operações de criação (`createBulk`), atualização (`updateBulk`) e exclusão (`deleteBulk`) em massa.
- **Transações "Tudo ou Nada"**: Todas as operações bulk foram encapsuladas em transações de banco de dados (`Knex Transaction`), garantindo atomicidade: ou a operação inteira é persistida, ou nada é alterado (rollback automático em caso de falha).
- **Validação de Bulk**: Adicionado utilitário `validateSchemaBulk` para realizar a validação de todos os itens do lote individualmente, coletando e reportando todos os erros de uma só vez, melhorando o feedback ao usuário final.
- **Camada Service/Controller**: Introduzidos métodos genéricos `createMany`, `updateMany` e `deleteMany` (no `BaseServices`) e `createBulkEntity`, `updateBulkEntity`, `deleteBulkEntity` (no `BaseController`), herdados automaticamente por todos os módulos do sistema.
- **Exposição de API**: Novas rotas `POST /bulk`, `PATCH /bulk`, `DELETE /bulk` habilitadas nos módulos (iniciado no módulo `users`), protegidas por `verifyAdmin`.

### 🛠️ Infraestrutura e Ferramentas

- **Geração Dinâmica**: O script `generate-entity.mjs` e seus arquivos base (`model.txt`, `routes.txt`) foram atualizados para criar automaticamente a estrutura completa de rotas e métodos bulk para novas entidades.
- **Qualidade de Testes**: Implementada suíte de testes unitários para a camada de Repositório e de integração para a camada de Serviços usando `Vitest`, garantindo a integridade do modelo "Tudo ou Nada".
- **Hardening de Tipagem**: Refatoração completa das novas funcionalidades Bulk, garantindo a eliminação de qualquer uso de `any` em favor de tipos genéricos (`T extends BaseEntity`, `CreateData<T>`, `UpdateData<T>`).

---

## [1.3.2] - 2026-04-17

### 🏗️ Arquitetura e Contratos

- **Sdk Hardening**: Transformação das classes de infraestrutura (`BaseController`, `ExpressAdapter`) em classes `abstract` com métodos `abstract` obrigatórios, garantindo que o SDK funcione estritamente como uma camada de definição de contratos (Interfaces e Contratos Puros).
- **Remoção de Skeleton Logic**: Eliminada a implementação vazia ("Skeleton") que retornava `{} as T` ou lançava `Error("SDK Skeleton")` em métodos de controller e adaptadores. Agora, a validação é feita via compilador TypeScript, aumentando a segurança.
- **Relacionamento de Tabelas**: Documentada a estratégia de Eager Loading via `ServiceFactory` e a configuração de relações nas definições de `Model` dentro dos módulos dinâmicos.
- **Segurança no Boot**: Refatorado o carregamento de instâncias em `routes.ts` para evitar dependências circulares de tempo de execução (runtime), melhorando a resiliência do boot da aplicação.

---

## [1.3.1] - 2026-04-15

### ✨ Novidades

- **Eager Loading Dinâmico**: Implementado suporte a carregamento de recursos relacionados via parâmetro `?include=` na URL.
- **ServiceFactory**: Novo motor de resolução dinâmica de serviços que permite o carregamento de relações respeitando as regras de negócio de cada módulo.
- **Segurança de Persistência (SchemaGuard)**: Adicionada validação automática de campos nos repositórios (`create` e `update`) para garantir que apenas colunas permitidas sejam persistidas no banco, com conversão automática de `camelCase` (JSON) para `snake_case` (banco).

### 🛠️ Infraestrutura e Tipagem

- **Hardening de Tipos**: Eliminação completa de qualquer uso de `any` e `unknown` na camada de repositório, adotando `KnexTable<T>` e `ResolveTableType` para tipagem estrita e segurança total em tempo de compilação.
- **Sincronização SDK**: O script `prepare-sdk.mjs` agora garante que os geradores de entidade e templates estejam sempre sincronizados com a versão mais recente do Core durante o `publish`.
- **Refatoração de Repositórios**: Centralização da lógica de filtros no utilitário `knexUtils.ts`, garantindo consistência e performance estável.
- **Gestão de Serviços**: Inicialização condicional de serviços (`ENABLE_REST`/`ENABLE_GRPC`) via variáveis de ambiente.

---

## [1.3.0] - 2026-04-14

### 🛡️ Segurança

- **Hardening de Docker**: Remoção de senhas padrão (`dbTreis0303`) do `docker-compose.yml`, tornando o uso de um arquivo `.env` personalizado obrigatório.
- **Princípio do Privilégio Mínimo**: Atualizado `Dockerfile` para rodar a aplicação como `USER node` (non-root), reduzindo riscos de exploração de contêiner.

### 📖 Documentação

- **Aviso Obrigatório**: Adicionado alerta no `README.md` enfatizando que a criação do arquivo `.env` é essencial para a inicialização do ambiente.

### 🛠️ Infraestrutura & Docker

- **Correção de Migração**: Ajustada a interpolação de variáveis no `command` do `db-migrator` no `docker-compose.yml` para evitar erros de variáveis não definidas.
- **Automação de Ambiente**: Adicionado script `npm run docker:refresh` para automatizar a parada, atualização e reconstrução dos contêineres (`down`, `pull`, `--build --force-recreate`).
- **Conectividade CLI**: Atualizado `generate-entity.mjs` para suportar `DB_HOST_LOCAL` (com fallback para `localhost`), permitindo a geração de módulos localmente enquanto a API aponta para o contêiner de banco.

### 🐛 Correções de Erros

- **HateoasTransformer**: Adicionado tratamento de erro robusto no método `addCollectionLinks` para evitar falhas de execução (`itemLinks is not a function...`) ao gerar links de coleções.

---

## [1.2.0] - 2026-04-13

### ✨ Novidades

- **Auto-Setup Admin**: Implementação de lógica de provisionamento automático. O primeiro usuário que se registrar no sistema (`/auth/register`) receberá automaticamente o cargo de `admin`.
- **Controle de Registro**: Adicionada a flag `ENABLE_PUBLIC_REGISTRATION` no `.env` para habilitar ou desabilitar o cadastro público de novos usuários após o setup inicial.
- **Registro Público**: Adicionada rota POST `/auth/register` no Core para facilitar o cadastro de novos usuários com suporte a hashing e pepper automático.
- **Suporte a Contagem (Count)**: Adicionado método `countAll()` aos serviços base e suporte a contagem de registros em todos os repositórios de leitura.

### 📖 Documentação

- **Documentação de Auth**: Atualizado o README para refletir o novo fluxo de criação de usuário administrador.

### 🛠️ Infraestrutura

- **Templates de Módulos**: Atualizado o template `model.txt` no SDK para suportar o novo método `count` nativamente.
- **Repositórios Base**: Atualizada a interface `Model` e o `BaseServices` para maior flexibilidade em operações de contagem.

---

## [1.1.0] - 2026-04-13

### ✨ Novidades

- **Arquitetura Hermética**: Implementação de Multi-Stage Build para proteger o Core do sistema. O usuário agora consome o Treis via Docker Hub (`felipetrevenzoli/treis-engine`).
- **Treis-DB**: Adicionada imagem de banco de dados customizada (`felipetrevenzoli/treis-db`) que já contém o DNA do Core.
- **CLI de Automação**: Inclusão do script `generate-entity.mjs` para criação automática de módulos.
- **Licença Apache 2.0**: Formalização da licença para o SDK público.
- **Gerenciamento de Banco**: Implementação do serviço `db-migrator` que executa automaticamente scripts SQL da pasta `./db` toda vez que o container sobe.
- **Inicialização do Core**: Scripts de setup inicial do Treis foram movidos para a pasta `./db-core` (executados apenas na criação do banco).

### 📖 Documentação

- **Refatoração do README**: Unificado com guia de instalação passo a passo, detalhamento da geração de módulos CLI e política de proteção de IP.
- **UPDATE.md**: Implementado rastreamento de mudanças para o repositório público.

### 🛠️ Infraestrutura

- **Docker Compose**: Simplificado para o usuário final, focado em "Plug-and-Play" de módulos em `src/dynamic-modules`.
- **Proteção de IP**: Remoção completa de arquivos `.ts` do Core na pasta do SDK, garantindo que o código-fonte proprietário não seja exposto no repositório público.

---

_Atualizado por Gemini CLI._
