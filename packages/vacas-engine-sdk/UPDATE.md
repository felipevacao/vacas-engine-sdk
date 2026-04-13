# 📝 Registro de Atualizações - Vacas-Engine SDK

Este arquivo registra todas as melhorias, correções e novos recursos adicionados ao SDK para o usuário final.

---

## [1.1.0] - 2026-04-13

### ✨ Novidades
- **Arquitetura Hermética**: Implementação de Multi-Stage Build para proteger o Core do sistema. O usuário agora consome o Treis via Docker Hub (`felipetrevenzoli/treis-engine`).
- **Treis-DB**: Adicionada imagem de banco de dados customizada (`felipetrevenzoli/treis-db`) que já contém o DNA do Core.
- **CLI de Automação**: Inclusão do script `generate-entity.mjs` para criação automática de módulos.
- **Licença Apache 2.0**: Formalização da licença para o SDK público.
- **Ambiente de Desenvolvimento Local**: Adicionado `package.json` com scripts para automação CLI e `.gitignore` para proteção de arquivos sensíveis.

### 📖 Documentação
- **Refatoração do README**: Unificado com guia de instalação passo a passo, detalhamento da geração de módulos CLI e política de proteção de IP.
- **UPDATE.md**: Implementado rastreamento de mudanças para o repositório público.


### 🛠️ Infraestrutura
- **Docker Compose**: Simplificado para o usuário final, focado em "Plug-and-Play" de módulos em `src/dynamic-modules`.
- **Proteção de IP**: Remoção completa de arquivos `.ts` do Core na pasta do SDK, garantindo que o código-fonte proprietário não seja exposto no repositório público.

---
*Atualizado por Gemini CLI.*
