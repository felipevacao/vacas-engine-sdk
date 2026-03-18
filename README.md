## Configuração e Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL (caso não utilize Docker)
- Docker e Docker Compose (opcional, mas recomendado)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` fornecido. As principais variáveis são:

```env
API_NAME=API Treis
NODE_ENV=development
DB_USER=
DB_PASS=
DB_NAME=
DB_HOST=
DB_PORT=
API_PORT=
ORIGIN=
ENABLE_TEST_ROUTES=true
ENABLE_HATEOAS=true
ENABLE_RETURN_ERRORS=true
```

### Instalação sem Docker

```bash
# Clone o repositório
git clone https://github.com/felipevacao/treis.git
cd treis

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

A API estará disponível em `http://localhost:` + API_PORT.

<!-- ### Instalação com Docker

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/treis-api.git
cd treis-api

# Suba os containers (PostgreSQL + API)
docker-compose up -d

# O servidor estará disponível em http://localhost:3000
```

O `docker-compose.yml` já configura o banco de dados e a aplicação, aplicando migrações automaticamente. -->

---

## Autenticação

A API utiliza Token para autenticação. Para acessar rotas protegidas, é necessário incluir no cabeçalho `Authorization` o token no formato `Bearer <token>`.

O token é obtido através da rota `/auth/login` e seu tempo de expiração varia conforme o **role** do usuário (admin, guest).

### Rotas de Autenticação

| Método | Rota                       | Descrição                                                      |
| ------ | -------------------------- | -------------------------------------------------------------- |
| POST   | `/auth/login`              | Realiza login e retorna um token                               |
| GET    | `/auth/logout`             | Invalida o token e a sessão                                    |
| GET    | `/auth/password/metadata`  | Retorna a estrutura esperada para alteração de senha           |
| PATCH  | `/auth/password`           | Altera a senha do usuário autenticado                          |
| POST   | `/auth/password/forgot`    | Solicita recuperação de senha, retorna token para reset        |
| GET    | `/auth/check/token=:token` | Verifica a validade do um token de reset e ativa a recuperacao |
| PATCH  | `/auth/password/reset`     | Redefine a senha usando token de recuperação                   |

> **Exemplo:** A rota `GET /auth/password/metadata` retorna um JSON como:
>
> ```json
> {
>   "currentPassword": "string",
>   "newPassword": "string"
> }
> ```
>
> Esse é o formato esperado no corpo da requisição `PATCH /auth/password`.

---

## API de Recursos (CRUD Genérico)

A Treis API gera automaticamente módulos para cada tabela do banco de dados. Para cada recurso (ex.: `usuarios`, `produtos`, `categorias`), são criados os seguintes endpoints:

| Método | Rota                  | Descrição                                |
| ------ | --------------------- | ---------------------------------------- |
| GET    | `/{recurso}`          | Lista todos os registros (com paginação) |
| GET    | `/{recurso}/:id`      | Retorna um registro específico           |
| POST   | `/{recurso}`          | Cria um novo registro                    |
| PATCH  | `/{recurso}/:id`      | Atualiza parcialmente um registro        |
| DELETE | `/{recurso}/:id`      | Remove um registro                       |
| GET    | `/{recurso}/metadata` | Retorna a estrutura esperada             |
| GET    | `/{recurso}/search`   | Pesquisa registro                        |

**Exemplo para o recurso `users`:**

- `GET /users` → lista de usuários.
- `GET /users/1` → usuário com ID 1.
- `GET /users/metadata` → retorna os campos necessários para criar/atualizar usuário, com tipos e validações.

### Estrutura de Resposta Padrão

Todas as respostas seguem o formato:

```json
{
  "success": true,
  "message": "Operação realizada com sucesso.",
  "data": { ... },        // ou array, dependendo do endpoint
  "error": { ... }, 	  // em caso de error
  "meta": {
		"timestamp": ""
  }
}
```

Em caso de erro, o campo `success` é `false` e `error` contém a descrição do erro.

---

## Exemplos de Uso com `curl`

### Login

```bash
curl -X POST http://localhost:$API_PORT/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com","password":"123456"}'
```

Resposta:

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "132837b6dc13c92929503a9115...",
    "expiresAt": ""
  },
  "meta": {
    "timestamp": ""
  }
}
```

### Acessando rota protegida (listar usuários)

```bash
curl -X GET http://localhost:$API_PORT/users \
  -H "Authorization: Bearer 132837b6dc13c92929503a9115..."
```

### Obtendo metadados para criação de um usuário

```bash
curl -X GET http://localhost:$API_PORT/users/metadata \
  -H "Authorization: Bearer <token>"
```

Resposta:

```json
{
  "success": true,
    "message": "Operação realizada com sucesso",
    "data": {
        "table": "users",
        "displayName": "Usuários",
        "description": "Gerenciamento de usuários",
        "fields": [{
                "name": "id",
                "type": "integer",
                "required": true,
                ...
        }]
	  }
}
```

---

## Estrutura do Projeto

```
treis-api/
├── scripts/				# Gera módulos
├── src/					# Source folder
│   ├── adapters/           # Adaptadores Padrão
│   ├── constants/          # Contansts do projeto
│   │   └── messages/       # Mensagens de codigo e texto
│   ├── controllers/        # Controladores Padrão
│   ├── dynamic-modules/    # Módulos gerados
│   │   ├── adapters/       # Adaptadores (Sem geração dinâmica)
│   │   ├── controllers/    # Controladores Gerados
│   │   ├── entities/       # Entidades Gerados
│   │   ├── manifests/      # Manifestos das Entidades (Sem geração dinâmica)
│   │   ├── models/         # Modelos Gerados
│   │   ├── routes/         # Rotas Gerados
│   │   └── services/       # Serviços Gerados
│   ├── libs/				# Libs
│   ├── middlewares/		# Middlewares
│   ├── repositories/		# CRUD genérico
│   ├── routes/				# Rotas Padrão
│   ├── services/			# Services Padrão
│   ├── transformers/		# Transformadores
│   ├── types/				# Tipos
│   ├── utils/				# Utilitários
│   ├── workflows/			# Workflows
│   └── index.ts            # Ponto de entrada
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

Os módulos gerados dinamicamente são organizados automaticamente nas pastas `controllers`, 'entities', `models`, `services` e `routes` dentro da pasta `dinamyc-modules`.
Os `adapters` e `manifests` não são gerados automáticamente.

---

## Contato

 - **E-mail:** felipe.trevenzoli@gmail.com
 - **Instagram:** [https://www.instagram.com/felipe.trevenzoli](https://www.instagram.com/felipe.trevenzoli)
