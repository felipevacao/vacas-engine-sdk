# 🚀 Guia de Implementação: Motor de API Hermético (Vacas-Engine)

Este guia descreve como utilizar o **Motor Treis** (Core) para criar novos aplicativos (ex: Comandas, Vendas, Financeiro) de forma modular, segura e escalável, protegendo sua propriedade intelectual.

---

## 🏗️ 1. Preparação das Imagens Base (O Motor)

Antes de iniciar qualquer novo aplicativo, as imagens base do motor devem estar construídas.

### A. Gerar a Imagem de Banco de Dados (DNA do Core)
Esta imagem contém o PostgreSQL 18 com o script `10-core-init.sql` (tabelas base de usuários, sessões e permissões).
```bash
# No diretório apps/treis/
docker build -f Dockerfile.db -t felipetrevenzoli/treis-db:latest .
```

### B. Gerar a Imagem Base da API (Engine/Builder)
Esta imagem contém o ambiente de build, o código-fonte do Core (`src/core`) e todas as dependências necessárias para compilar novos módulos.
```bash
# No diretório apps/treis/
docker build -f Dockerfile.engine -t felipetrevenzoli/treis-engine:latest .
```

---

## 📱 2. Criando um Novo Aplicativo (Exemplo para o Usuário Final)

Para criar um novo app, o usuário não precisa do código do Treis. Ele só precisa da sua imagem publicada e da estrutura abaixo:

### Estrutura do Projeto do Usuário:
```text
/projeto-comandas
├── src/
│   └── dynamic-modules/    # Onde o usuário coloca a lógica dele
│       └── pedidos/
│           ├── routes.ts   # O Core detectará este arquivo automaticamente
│           ├── controller.ts
│           └── service.ts
├── Dockerfile              # O "truque" da proteção de IP (veja abaixo)
├── docker-compose.yml      # Orquestração local
└── .env                    # Configurações de ambiente
```

### O Dockerfile do Usuário (Multi-Stage Build):
```dockerfile
# STAGE 1: Build (Compilação do Core + Módulos do Usuário)
FROM felipetrevenzoli/treis-engine:latest AS builder

# Copia os módulos locais do usuário para dentro do motor
COPY ./src/dynamic-modules ./src/dynamic-modules

# Realiza o build (gera a pasta /dist com JS puro)
RUN npm run build

# STAGE 2: Produção (Imagem Limpa e Protegida)
FROM node:25-alpine3.23
WORKDIR /app

# Copia apenas o resultado da compilação (Arquivos .ts são descartados aqui)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instala apenas dependências de produção
RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 3002 50051

CMD ["node", "dist/core/index.js"]
```

---

## 🔧 3. Checklist de Configuração (.env)

O usuário deve configurar as variáveis obrigatórias:
- `DB_HOST=db` (nome do serviço no docker-compose)
- `DB_USER=felipe`
- `DB_PASS=dbTreis0303`
- `PEPPER_VERSIONS='{"1": "sua-chave-aqui"}'`

---

## ⚡ 4. Execução

Para subir o aplicativo:
```bash
docker compose up --build
```

---

## 🛡️ 5. Benefícios da Arquitetura

1. **Segurança de IP:** O código-fonte TypeScript do Core nunca é entregue ao cliente final. O container de produção contém apenas o JavaScript transpilado.
2. **Atualização Centralizada:** Se você corrigir um bug no Core, basta atualizar a imagem `felipetrevenzoli/treis-engine:latest` e o cliente fará o rebuild.
3. **Plug-and-Play:** O motor resolve automaticamente rotas, gRPC, logs e erros para qualquer módulo injetado em `src/dynamic-modules`.

---
*Documentação oficial do ecossistema Vacas-Engine.*
