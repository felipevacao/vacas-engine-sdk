# 🚀 Vacas-Engine (Repositório Privado)

![Node.js](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge&logo=docker)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?style=for-the-badge&logo=postgresql)

Este é o monorepo central do ecossistema **Vacas-Engine**, contendo o motor de APIs **Treis** e o SDK Headless **Verona**. Este repositório é de uso exclusivo e contém a propriedade intelectual protegida do sistema.

---

## 🏗️ Estrutura do Monorepo

- 🧠 **`apps/treis/`**: O motor (API) central. Contém o Core, autenticação, persistência e gRPC.
- 🎨 **`packages/verona/`**: O SDK Headless de Frontend (Logic-as-a-Service).
- 📦 **`packages/vacas-engine-sdk/`**: O **Repositório Público (SDK)** espelhado para usuários finais.

---

## 📤 Fluxo de Publicação e Distribuição

Sempre que realizar melhorias no Core ou no SDK, utilize os comandos abaixo na raiz do projeto:

### A. Publicar o Treis (Docker Hub) 🐳
Atualiza as imagens oficiais no Docker Hub (`felipetrevenzoli/treis-engine` e `felipetrevenzoli/treis-db`).
```bash
npm run publish:treis
```

### B. Publicar o SDK (GitHub Público) 🐙
Sincroniza a pasta `packages/vacas-engine-sdk` com o repositório público: [felipevacao/vacas-engine-sdk](https://github.com/felipevacao/vacas-engine-sdk)
```bash
npm run publish:sdk
```

---

## 🛠️ Stack Tecnológica

| Componente | Tecnologias |
| :--- | :--- |
| **Backend (Treis)** | ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) ![gRPC](https://img.shields.io/badge/gRPC-4285F4?style=flat-square&logo=grpc&logoColor=white) ![Knex](https://img.shields.io/badge/Knex.js-E16422?style=flat-square&logo=knex.js&logoColor=white) ![Objection](https://img.shields.io/badge/Objection.js-333333?style=flat-square) |
| **Frontend (Verona)** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) |
| **Infraestrutura** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) ![GitHub_Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white) |

---

## 🛡️ Segurança e Propriedade Intelectual
Este repositório (**vacas-engine**) é **PRIVADO**. Nunca compartilhe acesso ou exponha o código fonte da pasta `apps/treis/src/core` publicamente. Para demonstração de portfólio ou uso por terceiros, utilize sempre o repositório do **Repositório Público (SDK)**.

---
*Ecossistema mantido por @felipevacao.*
