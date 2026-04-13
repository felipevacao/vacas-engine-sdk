# 📝 Registro de Atualizações - Vacas-Engine SDK

Este arquivo registra todas as melhorias, correções e novos recursos adicionados ao SDK para o usuário final.

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
- **Persistência de Dados**: O banco de dados agora salva as informações na pasta local `./data/postgres`, garantindo que os dados não sejam perdidos ao parar os containers.
- **Scripts SQL do Usuário**: Adicionada a pasta `./db` para que o usuário possa incluir seus próprios scripts SQL de criação de tabelas (`/docker-entrypoint-initdb.d/`).

### 📖 Documentação
- **Refatoração do README**: Unificado com guia de instalação passo a passo, detalhamento da geração de módulos CLI e política de proteção de IP.
- **UPDATE.md**: Implementado rastreamento de mudanças para o repositório público.


### 🛠️ Infraestrutura
- **Docker Compose**: Simplificado para o usuário final, focado em "Plug-and-Play" de módulos em `src/dynamic-modules`.
- **Proteção de IP**: Remoção completa de arquivos `.ts` do Core na pasta do SDK, garantindo que o código-fonte proprietário não seja exposto no repositório público.

---
*Atualizado por Gemini CLI.*
