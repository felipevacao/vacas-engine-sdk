# 🚀 Vacas-Engine SDK ( Treis API )

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![Typescript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![gRPC](https://img.shields.io/badge/gRPC-Proto3-blue)](https://grpc.io/)
[![Swagger](https://img.shields.io/badge/OpenAPI-3.0-green)](http://localhost:3000/api-docs)

Este é o kit de desenvolvimento oficial para criar aplicações modulares utilizando o **Treis**. Este SDK permite que você construa sistemas complexos (Comandas, Vendas, Financeiro) injetando sua lógica de negócio em um núcleo (Core) de alta performance, sem precisar lidar com a complexidade da infraestrutura base.

---

## 🏗️ 1. Preparação do Ambiente

Antes de iniciar, certifique-se de ter o **Docker** e o **Docker Compose** instalados.

### Dependências do Treis (API + Core)

O sistema consome as imagens base publicadas no Docker Hub:

- `felipevacao/treis-engine:latest`: O Treis de build e execução.
- `felipevacao/treis-db:latest`: O banco de dados com o DNA do Core (opcional, você pode usar um Postgres puro).

---

## 📱 2. Criando seu Primeiro Módulo

O Treis detecta automaticamente qualquer lógica injetada na pasta `src/dynamic-modules`. Siga o passo a passo para criar sua funcionalidade:

### Passo 1: Gere a Estrutura Base

Execute o assistente CLI para criar os arquivos necessários (Entidade, Controller, Service, Proto, etc):

```bash
node scripts/generate-entity.mjs
```

_Siga as instruções no terminal para definir o nome do módulo e os campos da tabela._

### Passo 2: Configure as Rotas

O script criará a pasta em `src/dynamic-modules/[nome-do-modulo]`. O arquivo `routes.ts` gerado será registrado automaticamente pelo Treis no prefixo do módulo.

### Passo 3: Implemente a Lógica

Edite o arquivo `service.ts` para adicionar suas regras de negócio. O Treis já provê repositórios base (CRUD) prontos para uso.

---

## 🔧 3. Configuração (.env)

Renomeie o arquivo `.env.example` para `.env` e ajuste as variáveis obrigatórias:

- `DB_HOST=db` (nome do serviço no docker-compose)
- `DB_USER=felipe`
- `DB_PASS=dbTreis0303`
- `PEPPER_VERSIONS='{"1": "sua-chave-secreta-aqui"}'`

---

## ⚡ 4. Execução e Build (A Mágica)

Para subir o aplicativo com seus módulos injetados no Treis:

```bash
docker compose up --build
```

### O que acontece durante o processo:

1. **Injeção:** Seus módulos são copiados para dentro da estrutura do Treis em tempo de build.
2. **Compilação JIT:** O Treis compila o Core + Seus Módulos em um único pacote `dist/`.
3. **Proteção de IP:** Os arquivos `.ts` originais são descartados. O container final contém apenas o binário JS transpilado.
4. **Auto-Discovery:** Ao iniciar, o Treis varre a pasta `dist/dynamic-modules`, detecta suas rotas e as registra automaticamente no Express e gRPC.

---

## 🛡️ 5. Benefícios da Arquitetura

1. **Segurança de IP:** O código-fonte do Core nunca é exposto. O cliente recebe apenas o "binário" JS resultante da compilação.
2. **Manutenibilidade Centralizada:** Correções de segurança e melhorias no Core são propagadas para todos os Apps apenas atualizando a imagem base.
3. **Escalabilidade:** Cada aplicativo é independente e isolado, mas compartilha a mesma robustez e padrões do Treis principal.

---

## 👨‍💻 Autor

**Felipe Trevenzoli**

- [GitHub](https://github.com/felipevacao)
- [Instagram](https://www.instagram.com/felipe.trevenzoli)
- [LinkedIn](https://www.linkedin.com/in/felipetrevenzoli/)

_Documentação oficial do ecossistema Vacas-Engine._
