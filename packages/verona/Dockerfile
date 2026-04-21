FROM node:25-alpine3.23

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Como é um SDK Headless, ele pode ser usado como um serviço que provê metadados processados
# ou apenas ser montado como volume. Por enquanto, vamos deixá-lo pronto para rodar.
CMD ["npm", "run", "dev"]
