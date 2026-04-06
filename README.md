# 🚀 Treis API (v3.4.0)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![Typescript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![gRPC](https://img.shields.io/badge/gRPC-Proto3-blue)](https://grpc.io/)
[![Swagger](https://img.shields.io/badge/OpenAPI-3.0-green)](http://localhost:3000/api-docs)

A **Treis API** é uma solução avançada e modular para o gerenciamento dinâmico de dados. Projetada seguindo princípios de **Clean Architecture**, ela permite a criação automatizada de recursos CRUD completos tanto via **REST (JSON)** quanto via **gRPC (Protocol Buffers)**.

---

## 🏗️ Arquitetura Core Engine

A API evoluiu para uma estrutura de **Core Engine**, onde a infraestrutura central (Core) é separada dos módulos dinâmicos específicos de cada projeto, permitindo a injeção de regras de negócio isoladas enquanto se mantém um núcleo compartilhado.

- **Core Engine**: Contém a infraestrutura compartilhada (Adapters, Middlewares, BaseServices, Autenticação).
- **Server-Driven UI**: A API fornece metadados dinâmicos para a montagem de formulários no Frontend.
- **Herança Docker**: Facilita a criação de instâncias isoladas por projeto.

---

## 🌟 Principais Diferenciais

- **⚙️ Geração Dinâmica:** Scaffolding automatizado de novos módulos (Entity, Model, Service, Controller, Route, Proto, GrpcAdapter).
- **📡 Multi-Protocolo:** Suporte nativo a **REST/HTTP** e **gRPC (BFF Architecture)**.
- **📖 Auto-Documentação:** Integração nativa com **Swagger** para REST. Novos módulos já nascem documentados.
- **🗺️ HATEOAS & Metadata:** Respostas inteligentes que descrevem a estrutura dos dados e ações relacionadas.
- **🛡️ Segurança:** Autenticação Bearer Token, Refresh Tokens, Roles e proteção **Service-to-Service** via Internal API Key.
- **🔌 Arquitetura de Adaptadores:** Desacoplamento total do framework de entrega.

---

## 🛠️ Tecnologias

- **Runtime:** Node.js (TypeScript)
- **Framework REST:** Express.js
- **Framework Interno:** gRPC (Proto3)
- **Documentação:** Swagger UI & Swagger JSDoc (OpenAPI 3.0)
- **Banco de Dados:** PostgreSQL via Knex.js & Objection.js
- **Segurança:** Helmet, Bcrypt + HMAC Pepper, Express Rate Limit, Express Validator
- **Container:** Docker & Docker Compose

---

## 📡 gRPC (Backend-to-Backend)

A Treis API foi projetada para atuar em uma arquitetura de microsserviços ou BFF (Backend-for-Frontend).

- **Porta:** `50051`
- **Contratos:** Arquivos `.proto` localizados em `src/core/modules/*/` ou `src/dynamic-modules/protos/`.
- **Performance:** Comunicação binária de baixa latência ideal para comunicação entre containers.
- **Segurança:** Requer `x-internal-key` no metadata de cada chamada.

---

## 🔒 Segurança

A API implementa diversas camadas de proteção seguindo as melhores práticas do OWASP:

- **Service-to-Service Auth:** Proteção de chamadas gRPC através de uma chave secreta compartilhada (`INTERNAL_API_KEY`).
- **Cabeçalhos HTTP:** Utiliza `Helmet` para proteção automática contra XSS, Clickjacking e MIME Sniffing.
- **Limitação de Taxa (Rate Limit):** Proteção global de 100 requisições a cada 15 minutos por IP.
- **Integridade de Dados:**
  - Proteção rigorosa contra _Mass Assignment_.
  - Payload máximo de JSON limitado a **10kb**.
- **Autenticação Avançada:**
  - Senhas criptografadas com `bcrypt` combinado a um `HMAC Pepper`.
  - Validação de sessão vinculada ao endereço IP do cliente.
- **Zero `any`:** Todo o codebase segue a diretriz estrita de tipagem forte.

---

## 🚀 Configuração e Instalação

### Pré-requisitos

- Node.js 18+
- Docker & Docker Compose (Recomendado)

### Instalação via Docker

```bash
git clone https://github.com/felipevacao/treis.git
cd treis
docker-compose up -d
```

API REST: `http://localhost:3000` | gRPC Server: `localhost:50051` | Swagger: `http://localhost:3000/api-docs`

### Variáveis de Ambiente (.env)

| Variável           | Descrição                               | Padrão                    |
| :----------------- | :-------------------------------------- | :------------------------ |
| `API_PORT`         | Porta de execução da API REST           | `3000`                    |
| `DB_HOST`          | Endereço do banco PostgreSQL            | `localhost`               |
| `INTERNAL_API_KEY` | Chave secreta para autenticação gRPC    | `S3cr3t_K3y_F0r_gRPC_BFF` |
| `ENABLE_HATEOAS`   | Habilita links hipermídia nas respostas | `true`                    |
| `SALT_ROUNDS`      | Custo do Hash Bcrypt                    | `10`                      |

---

## 🏗️ Geração de Módulos

Crie um CRUD completo a partir de uma tabela existente no banco de dados:

```bash
npm run generate:entity
```

---

## 🔐 Autenticação e Roles

A API utiliza níveis de acesso (Roles) para proteger recursos sensíveis.

| Método  | Endpoint            | Proteção        |
| :------ | :------------------ | :-------------- |
| `POST`  | `/auth/login`       | Pública         |
| `GET`   | `/auth/me`          | Logado (Bearer) |
| `PATCH` | `/users/update/:id` | Admin Only      |

---

## 📁 Estrutura de Pastas

```text
src/
├── core/                 # Core Engine (Infra, Auth, BaseServices)
│   ├── modules/          # Módulos Base (Built-in: Users, Auth)
│   ├── adapters/
│   ├── libs/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── transformers/
│   ├── types/
│   ├── utils/
│   ├── workflows/
│   └── index.ts        # Inicializador principal
└── dynamic-modules/    # Extensões específicas de cada projeto
    ├── adapters/       # Adaptadores
    │   ├── express/
    │   └── grpc/
    ├── protos/         # Contratos Protocol Buffers (.proto)
    ├── entities/       # Definições de entidades + Swagger Schemas
    ├── models/         # Modelos ORM (Objection.js)
    ├── routes/         # Definições de rotas + Swagger Docs
    └── services/       # Lógica de negócio específica
```

## ⚙️ Aliases (Path Mapping)

- `@core/*`: `./src/core/*`
- `@core-modules/*`: `./src/core/modules/*`
- `@dynamic-modules/*`: `./src/dynamic-modules/*`
- `@app-types/*`: `./src/core/types/*`
- `@workflows/*`: `./src/core/workflows/*`

---

## 📄 Licença

Projeto sob licença [ISC](https://opensource.org/licenses/ISC).

---

## 👨‍💻 Autor

**Felipe Trevenzoli**

- [GitHub](https://github.com/felipevacao)
- [Instagram](https://www.instagram.com/felipe.trevenzoli)
- [LinkedIn](https://www.linkedin.com/in/felipetrevenzoli/)

---

_Treis API - Construindo o futuro do gerenciamento de dados de forma dinâmica._
