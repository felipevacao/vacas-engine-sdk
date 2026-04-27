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
   git clone https://github.com/felipevacao/treis-sdk.git
   cd treis-sdk
   ```

2. **Instale as Ferramentas CLI:**

   ```bash
   npm install
   ```

3. **Configure o Ambiente:**

   ```bash
   cp .env.example .env
   ```
   *Nota: A criação deste arquivo é **obrigatória**. O sistema depende das variáveis de ambiente definidas nele (especialmente DB_USER, DB_PASS, DB_NAME) para inicializar os contêineres.*

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

## ⚡ 3. Fluxo de Execução

O Treis requer que o banco de dados esteja ativo para a geração de módulos via CLI.

1. **Inicie o Banco de Dados:**
   ```bash
   docker compose up -d db db-migrator
   ```

2. **Gere seus Módulos (CLI):**
   Com o banco rodando, gere suas entidades e serviços:
   ```bash
   npm run generate:module
   ```

3. **Inicie a API:**
   Após gerar os módulos, suba o serviço da API:
   ```bash
   docker compose --profile api up -d
   ```

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
