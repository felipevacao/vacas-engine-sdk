# 🚀 Vacas-Engine (Repositório Privado)

Este é o monorepo central do ecossistema **Vacas-Engine**, contendo o motor de APIs **Treis** e o SDK Headless **Verona**. Este repositório é de uso exclusivo e contém a propriedade intelectual protegida do sistema.

---

## 🏗️ Estrutura do Monorepo

- **`apps/treis/`**: O motor (API) central. Contém o Core, autenticação, persistência e gRPC.
- **`packages/verona/`**: O SDK Headless de Frontend.
- **`packages/vacas-engine-sdk/`**: O **Repositório Público** (SDK) espelhado para usuários finais.

---

## 📤 Fluxo de Publicação e Distribuição

Sempre que realizar melhorias no Core ou no SDK, utilize os comandos abaixo na raiz do projeto:

### A. Publicar o Treis (Docker Hub)
Atualiza as imagens oficiais no Docker Hub (`felipetrevenzoli/treis-engine` e `felipetrevenzoli/treis-db`).
```bash
npm run publish:treis
```

### B. Publicar o SDK (GitHub Público)
Sincroniza a pasta `packages/vacas-engine-sdk` com o repositório público: [https://github.com/felipevacao/vacas-engine-sdk](https://github.com/felipevacao/vacas-engine-sdk)
```bash
npm run publish:sdk
```

---

## 🛠️ Comandos de Desenvolvimento

- **Treis (API) em modo dev:** `npm run treis:dev`
- **Verona (Front) em modo dev:** `npm run verona:dev`
- **Lint global:** `npm run lint`

---

## 🛡️ Segurança e Propriedade Intelectual
Este repositório (**vacas-engine**) é **PRIVADO**. Nunca compartilhe acesso ou exponha o código fonte da pasta `apps/treis/src/core` publicamente. Para demonstração de portfólio ou uso por terceiros, utilize sempre o repositório do **Repositório Público (SDK)**.

---
*Ecossistema mantido por @felipevacao.*
