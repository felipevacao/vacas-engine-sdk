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
ENV NODE_ENV=production
ENV DB_HOST=db
ENV API_PORT=$PORT

EXPOSE $PORT

CMD ["node", "--trace-deprecation", "dist/core/index.js"]