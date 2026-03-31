# 🚀 Treis API (v3.3.58)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![Typescript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Swagger](https://img.shields.io/badge/OpenAPI-3.0-green)](http://localhost:3000/api-docs)

A **Treis API** é uma solução avançada e modular para o gerenciamento dinâmico de dados. Projetada seguindo princípios de **Clean Architecture**, ela permite a criação automatizada de recursos CRUD completos a partir de definições de banco de dados.

---

## 🌟 Principais Diferenciais

- **⚙️ Geração Dinâmica:** Scaffolding automatizado de novos módulos (Entity, Model, Service, Controller, Route).
- **📖 Auto-Documentação:** Integração nativa com **Swagger**. Novos módulos já nascem documentados.
- **🗺️ HATEOAS & Metadata:** Respostas inteligentes que descrevem a estrutura dos dados e ações relacionadas.
- **🛡️ Segurança:** Autenticação JWT, Refresh Tokens, Roles e proteção contra brute-force (Rate Limit).
- **🔌 Arquitetura de Adaptadores:** Desacoplamento total do framework de entrega.

---

## 🛠️ Tecnologias

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **Documentação:** Swagger UI & Swagger JSDoc (OpenAPI 3.0)
- **Banco de Dados:** PostgreSQL via Knex.js & Objection.js
- **Segurança:** Bcrypt, Express Rate Limit, Validator
- **Container:** Docker & Docker Compose

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

API: `http://localhost:3000` | Swagger: `http://localhost:3000/api-docs`

### Variáveis de Ambiente (.env)

| Variável               | Descrição                               | Padrão      |
| :--------------------- | :-------------------------------------- | :---------- |
| `API_PORT`             | Porta de execução da API                | `3000`      |
| `DB_HOST`              | Endereço do banco PostgreSQL            | `localhost` |
| `ENABLE_HATEOAS`       | Habilita links hipermídia nas respostas | `true`      |
| `ENABLE_RETURN_ERRORS` | Retorna stack trace em erros (Dev)      | `true`      |
| `SALT_ROUNDS`          | Custo do Hash Bcrypt                    | `10`        |

---

## 🏗️ Geração de Módulos

Crie um CRUD completo a partir de uma tabela existente:

```bash
npm run generate:entity
```

_O script mapeia automaticamente as colunas do banco para schemas Swagger e interfaces TypeScript._

---

## 📡 Padrão de Resposta (JSON)

Todas as respostas seguem um envelope padronizado para facilitar o consumo pelo Front-end:

### Sucesso (Com HATEOAS)

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { "id": "uuid", "name": "Exemplo" },
  "meta": {
    "timestamp": "2023-10-27T10:00:00Z",
    "requestId": "req-123",
    "metadataUrl": "/recurso/metadata"
  }
}
```

### Busca e Filtros

A API suporta filtros avançados via query string em endpoints de `/search`:

- `field`: Campo para filtrar.
- `operator`: Operador (`=`, `!=`, `like`).
- `value`: Valor da busca.

Exemplo: `GET /users/search?field=email&operator=like&value=@gmail.com`

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
├── adapters/          # Adaptadores (Express/System)
├── constants/         # Status HTTP e mensagens do sistema                                                                                             │
├── controllers/       # Controladores base e globais                                                                                                   │
├── dynamic-modules/   # Módulos gerados automaticamente                                                                                                │
│   ├── adapters/      # Adaptadores específicos de módulos                                                                                             │
│   ├── controllers/   # Regras de fluxo de dados                                                                                                       │
│   ├── entities/      # Definições de entidades + Swagger Schemas                                                                                      │
│   ├── models/        # Modelos ORM (Objection.js)                                                                                                     │
│   ├── routes/        # Definições de rotas + Swagger Docs                                                                                             │
│   └── services/      # Lógica de negócio específica                                                                                                   │
├── middlewares/       # Auth, Log, Error Handlers
├── repositories/      # Persistência genérica (CRUD)
├── routes/            # Rotas estáticas (Auth, System, etc)                                                                                            │
├── services/          # Regras de negócio globais
├── utils/             # Log, Swagger, ResponseHandler
└── workflows/         # Orquestração de processos complexos
```

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
