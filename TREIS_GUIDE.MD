# 📘 Guia Técnico do Motor Treis (Vacas-Engine)

O **Treis** é o núcleo de backend do ecossistema Vacas-Engine. Ele foi projetado para ser um motor de dados robusto, multiprotocolo (REST/gRPC) e altamente modular.

---

## 🏛️ 1. Filosofia Arquitetural: Core-Modular

O Treis separa rigorosamente a **Infraestrutura** da **Lógica de Negócio**:

- **Core (`src/core/`):** Contém os protocolos de segurança, adaptadores de rede, tratamento de erros centralizado e as classes base. O Core evolui sem quebrar as regras de negócio.
- **Dynamic Modules (`src/dynamic-modules/`):** É onde reside a inteligência do seu sistema. Cada pasta representa uma entidade de negócio autossuficiente (Produtos, Vendas, Usuários).

### O Fluxo de uma Requisição:
1. **Adapter (Rede):** Express (REST) ou gRPC recebe a chamada.
2. **Service (Lógica):** Onde as regras de negócio, validações e cálculos virtuais residem.
3. **Controller (Orquestração):** Media o Service e o Model.
4. **Model (Definição):** Define campos, filtros permitidos e relações (Eager Loading).
5. **Repository (Dados):** Camada de persistência que utiliza Knex.js para queries atômicas.

---

## 🔐 2. Segurança e Sessões (Opaque Tokens)

Diferente de sistemas que utilizam JWT (estateless), o Treis utiliza **Sessões Reais e Opacas** para maior controle e segurança.

- **Tokens Bearer:** Tokens aleatórios de 32 bytes gerados via `crypto.randomBytes`.
- **Persistência:** Todo token é hasheado (`sha256 + pepper`) e armazenado na tabela `user_sessions`.
- **Validação:** O `tokenMiddleware` verifica o token a cada requisição, comparando o hash de forma segura contra timing attacks (`crypto.timingSafeEqual`).
- **Revogação Instantânea:** Como as sessões estão no banco, um administrador pode revogar o acesso de qualquer usuário em tempo real.
- **Hashing de Senhas:** Utiliza `bcrypt` com um sistema de **Double Pepper** (um fixo no `.env` e um rotativo por usuário).

---

## 🚀 3. Desenvolvimento de Módulos Dinâmicos

O desenvolvimento no Treis é acelerado por automação.

### Gerando um Novo Módulo:
```bash
npm run generate:entity
```
Este comando lê a estrutura da sua tabela no banco de dados e gera automaticamente:
- `entity.ts`: Interfaces TypeScript e Schemas Swagger.
- `model.ts`: Configuração de campos e relações.
- `service.ts`: Classe de serviço estendendo o `BaseServices`.
- `virtuals.ts`: Local para definir campos calculados.
- `index.ts`: Exportador central do módulo.

### Campos Calculados Virtuais:
No arquivo `virtuals.ts`, você pode definir campos que não existem no banco de dados:
```typescript
export const UserVirtuals: IVirtualFieldDefinition<UsersEntity> = {
    nome_exibicao: (row) => `${row.name} (${row.login})`
};
```

---

## 📡 4. Protocolos e API

### REST (Express)
- **Filtros Dinâmicos:** Suporte a filtros complexos via query string (Ex: `?filters[0][field]=nome&filters[0][operator]=LIKE&filters[0][value]=%vacas%`).
- **Eager Loading:** Peça relações na mesma chamada: `?include=pedidos,enderecos`.
- **HATEOAS:** Quando ativado, as respostas incluem links de navegação automática (`_links`).

### gRPC
O Treis expõe serviços via gRPC para comunicação interna de alta performance entre microsserviços do ecossistema Vacas-Engine.

---

## 🛠️ 5. Comandos e Operações

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o motor em modo desenvolvimento com hot-reload. |
| `npm run build` | Compila o TypeScript para JavaScript (dist). |
| `npm run test` | Executa a suíte de testes unitários e de integração (Vitest). |
| `npm run generate:entity` | CLI interativo para criação de novos módulos. |
| `npm run docker:refresh` | Reinicia completamente o ambiente Docker (DB + Engine). |

---

## 📝 6. Boas Práticas
1. **Evite `any`:** O Treis é rigorosamente tipado. Use as interfaces geradas em `entity.ts`.
2. **Business Logic nos Services:** Nunca coloque lógica de banco no Controller ou lógica de rede no Service.
3. **Use Transações:** Para operações que envolvem múltiplas tabelas, utilize o suporte a transações do Knex injetado nos repositórios.
