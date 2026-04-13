# 🚀 Treis SDK (Vacas-Engine)

O **Treis SDK** é o kit de desenvolvimento oficial para criar aplicações modulares, escaláveis e seguras utilizando o ecossistema **Vacas-Engine**. Com ele, você constrói a lógica de negócio (Comandas, Vendas, Financeiro) enquanto o **Treis** cuida da infraestrutura, gRPC, Auth e persistência.

---

## 🏗️ 1. Instalação e Setup

Siga os passos abaixo para preparar seu ambiente local:

### Pré-requisitos
- **Docker** e **Docker Compose** instalados.
- **Node.js 22+** (para rodar as ferramentas CLI).

### Passo a Passo
1. **Clone o repositório do SDK:**
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

O Treis utiliza um assistente de linha de comando para garantir que seus novos módulos sigam os padrões arquiteturais do sistema.

### Criando um novo módulo:
```bash
npm run generate:module
```

**O que o script gera automaticamente:**
- ✅ **Entidade:** Modelagem com Objection.js.
- ✅ **Controller:** Endpoints Express pré-configurados.
- ✅ **Service:** Camada de negócio com repositórios CRUD base.
- ✅ **Proto:** Definições gRPC de alta performance.
- ✅ **Routes:** Registro automático de rotas no motor.

---

## ⚡ 3. Desenvolvimento e Build

Sempre que você adicionar um novo módulo ou alterar a lógica em `src/dynamic-modules/`, execute o rebuild para injetar as mudanças no Treis:

```bash
npm run docker:dev
```

### Por que o Build é necessário?
O **Treis** utiliza uma arquitetura de compilação em tempo de build que injeta seus módulos no Core e gera um binário JavaScript otimizado (`dist/`), descartando os fontes TypeScript para proteger a propriedade intelectual.

---

## 🛡️ 4. Licença

Este SDK é distribuído sob a **Licença Apache 2.0**. 

Você é livre para usar, modificar e distribuir este SDK em seus próprios projetos. Note que o **Core (Treis API)** consumido via imagem Docker (`felipetrevenzoli/treis-engine`) é de propriedade protegida e distribuído apenas como binário executável.

---
*Documentação oficial mantida por @felipevacao.*
