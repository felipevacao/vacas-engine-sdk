# 📝 Registro de Atualizações - Vacas-Engine SDK

Este arquivo registra todas as melhorias, correções e novos recursos adicionados ao SDK para o usuário final.

---

## [1.1.0] - 2026-04-13

### ✨ Novidades
- **Arquitetura Hermética**: Implementação de Multi-Stage Build para proteger o Core do sistema. O usuário agora consome o Treis via Docker Hub (`felipetrevenzoli/treis-engine`).
- **Treis-DB**: Adicionada imagem de banco de dados customizada (`felipetrevenzoli/treis-db`) que já contém o DNA do Core (tabelas de usuários, sessões e permissões).
- **CLI de Automação**: Inclusão do script `generate-entity.mjs` para criação automática de módulos (Entidades, Controllers, Services, Protos e Rotas).

### 📖 Documentação
- **Novo README**: Guia completo de implementação, passo a passo de criação de módulos e instruções de execução com Docker Compose.

### 🛠️ Infraestrutura
- **Docker Compose**: Simplificado para o usuário final, focado em "Plug-and-Play" de módulos em `src/dynamic-modules`.
- **Proteção de IP**: Remoção completa de arquivos `.ts` do Core na pasta do SDK, garantindo que o código-fonte proprietário não seja exposto no repositório público.

---
*Atualizado por Gemini CLI.*
