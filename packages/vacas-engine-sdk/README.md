# 🚀 Treis SDK (Vacas-Engine)

![Apache-2.0 License](https://img.shields.io/badge/License-Apache--2.0-blue.svg?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)

O **Treis SDK** é o kit de desenvolvimento oficial para criar aplicações modulares, escaláveis e seguras utilizando o ecossistema **Vacas-Engine**. Com ele, você constrói a lógica de negócio (Comandas, Vendas, Financeiro) enquanto o **Treis** cuida de toda a infraestrutura complexa.

---

## 🏗️ 1. Instalação e Setup

Siga os passos abaixo para preparar seu ambiente local:

### 🛠️ Pré-requisitos

- **Docker** e **Docker Compose**
- **Node.js 22+**

### 📋 Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/felipevacao/vacas-engine-sdk.git
   cd vacas-engine-sdk
   ```

2. **Instale as Ferramentas CLI:**

   ```bash
   npm install
   ```

3. **Configure o Ambiente:**

   ```bash
   cp .env.example .env
   ```

4. **Suba o Sistema:**
   ```bash
   npm run docker:dev
   ```

---

## 📱 2. Geração de Módulos (CLI)

Utilize o assistente CLI para automatizar a criação de novas funcionalidades:

```bash
npm run generate:module
```

**O que o Treis gera para você:**

- ✅ **Entidade:** Modelagem ![Objection](https://img.shields.io/badge/Objection.js-333333?style=flat-square) com JSON Schema.
- ✅ **Controller:** Endpoints ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white).
- ✅ **Service:** Camada de negócio e Repositórios CRUD.
- ✅ **Proto:** Contratos ![gRPC](https://img.shields.io/badge/gRPC-4285F4?style=flat-square&logo=grpc&logoColor=white).
- ✅ **Routes:** Auto-registro no motor.

---

## ⚡ 3. Desenvolvimento e Build

Sempre que alterar a lógica em `src/dynamic-modules/`, realize o rebuild para aplicar as mudanças:

```bash
npm run docker:dev
```

> **Por que o Build?** O Treis utiliza arquitetura de injeção em tempo de compilação, protegendo a propriedade intelectual ao converter seu TypeScript em um binário JavaScript otimizado (`dist/`).

---

## 🏢 Arquitetura e Stack

| Camada           | Tecnologias                                                                                                                                                                                                         |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Persistência** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) ![Knex](https://img.shields.io/badge/Knex.js-E16422?style=flat-square&logo=knex.js&logoColor=white) |
| **Comunicação**  | ![REST](https://img.shields.io/badge/REST_API-green?style=flat-square) ![gRPC](https://img.shields.io/badge/gRPC-4285F4?style=flat-square&logo=grpc&logoColor=white)                                                |
| **Documentação** | ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)                                                                                                              |

---

## 🛡️ Licença

Distribuído sob a **Licença Apache 2.0**.

---

_Documentação oficial mantida por @felipevacao._
