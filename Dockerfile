# Usa a imagem oficial do Node.js versão 16 como base
FROM node:23.9.0-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências (package.json e package-lock.json)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para o container
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Expõe a porta 3000 (a mesma que a API usa)
EXPOSE 3000

# Comando para rodar a API
CMD ["node", "dist/index.js"]