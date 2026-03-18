# 🚀 Treis API (v3.3.58)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![Typescript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A **Treis API** é uma solução avançada e modular para o gerenciamento dinâmico de dados. Projetada seguindo princípios de **Clean Architecture**, ela permite a criação automatizada de recursos CRUD completos (Model, Controller, Service, Route e Entity) a partir de definições de banco de dados, reduzindo drasticamente o tempo de desenvolvimento.

---

## 🌟 Principais Diferenciais

- **⚙️ Geração Dinâmica:** Script automatizado para scaffolding de novos módulos.
- **🗺️ HATEOAS Ready:** Suporte nativo para hipermídia nas respostas da API.
- **📋 Metadata Driven:** Endpoints que descrevem a estrutura dos dados, facilitando a integração com front-ends dinâmicos.
- **🛡️ Segurança Robusta:** Autenticação via Token, gerenciamento de Roles e proteção contra brute-force.
- **🔌 Arquitetura de Adaptadores:** Desacoplamento do framework Express através de adapters, facilitando testes e manutenibilidade.

---

## 🛠️ Tecnologias

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **Banco de Dados:** PostgreSQL via Knex.js & Objection.js (ORM)
- **Comunicação:** Suporte a Protocol Buffers (gRPC/Proto)
- **Container:** Docker & Docker Compose
- **Segurança:** Bcrypt, Express Rate Limit, Validator

---

## 🚀 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose (Recomendado)

### Instalação via Docker (Rápida)

```bash
# Clone o repositório
git clone https://github.com/felipevacao/treis.git
cd treis

# Suba o ambiente completo (Banco + API)
docker-compose up -d
```
A API estará disponível em `http://localhost:3000` (ou na porta configurada).

### Instalação Manual

1.  **Dependências:** `npm install`
2.  **Variáveis de Ambiente:** Copie o `.env.example` para `.env` e configure suas credenciais.
3.  **Execução:**
    - Desenvolvimento: `npm run dev`
    - Produção: `npm run build && npm start`

---

## 🏗️ Geração de Novos Módulos

Um dos pilares da Treis API é a automação. Para criar um novo recurso (ex: `produtos`):

```bash
npm run generate:entity
```
*Siga as instruções do prompt para definir o nome da tabela e os campos. O script criará automaticamente toda a estrutura em `src/dynamic-modules`.*

---

## 🔐 Autenticação e Roles

A API gerencia o acesso através de níveis (Roles). O tempo de vida do token e as permissões de rota variam conforme o perfil.

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Autenticação inicial |
| `PATCH` | `/auth/password` | Alteração de senha logada |
| `GET` | `/{resource}/metadata` | Estrutura de campos e validações |

---

## 📁 Estrutura de Pastas

```text
src/
├── adapters/          # Adaptadores de framework (Express/gRPC)
├── dynamic-modules/   # Módulos gerados automaticamente
├── repositories/      # Lógica de persistência genérica (CRUD)
├── services/          # Regras de negócio compartilhadas
├── workflows/         # Orquestração de processos complexos
├── types/             # Definições de interfaces e tipos TS
└── utils/             # Helpers e utilitários globais
```

---

## 📄 Licença

Este projeto está sob a licença [ISC](https://opensource.org/licenses/ISC).

---

## 👨‍💻 Autor

**Felipe Trevenzoli**
- [GitHub](https://github.com/felipevacao)
- [Instagram](https://www.instagram.com/felipe.trevenzoli)
- [LinkedIn](https://www.linkedin.com/in/felipe-trevenzoli/)

---
*Treis API - Construindo o futuro do gerenciamento de dados de forma dinâmica.*
