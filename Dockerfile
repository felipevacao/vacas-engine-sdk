# Usa a imagem oficial do Node.js versão 16 como base
FROM node:23.11.0-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app
RUN apk add --no-cache python3 make g++
# Copia os arquivos de dependências (package.json e package-lock.json)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para o container
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build
RUN npm ci --only=production

ARG DB_PASS
ARG PORT=3002

ENV NODE_ENV=production
ENV DB_USER=felipe
ENV DB_PASSWORD=$DB_PASS
ENV DB_NAME=apitreis
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV API_PORT=$PORT
ENV ENABLE_TEST_ROUTES=false
ENV ENABLE_HATEOAS=false
ENV ENABLE_RETURN_ERRORS=false
ENV SALT_ROUNDS=12

# Expõe a porta (a mesma que a API usa)
EXPOSE $PORT

# Comando para rodar a API
CMD ["node", "dist/index.js"]