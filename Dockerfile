FROM node:25-alpine3.23

WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm --version
RUN npm install

COPY . .

RUN npm run build
RUN npm ci --only=production

# ARGs apenas para build time (se necessário)
ARG PORT=3002

# ENVs sem valores padrão - serão passadas em runtime
ENV API_NAME='API Treis'
ENV NODE_ENV=production
ENV DB_USER=felipe
ENV DB_NAME=apitreis
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV API_PORT=$PORT
ENV ENABLE_TEST_ROUTES=false
ENV ENABLE_HATEOAS=false
ENV ENABLE_RETURN_ERRORS=false
ENV SALT_ROUNDS=12

# Variáveis sensíveis - sem valores no Dockerfile
ENV DB_PASS=""
ENV PEPPER_VERSIONS=""
ENV PEPPER_CURRENT=""

EXPOSE $PORT

CMD ["node", "--trace-deprecation", "dist/index.js"]