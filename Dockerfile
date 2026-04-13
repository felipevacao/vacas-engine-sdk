# STAGE 1: Build (Injeta módulos no motor e compila)
FROM felipetrevenzoli/treis-engine:latest AS builder
COPY ./src/dynamic-modules ./src/dynamic-modules
RUN npm run build

# STAGE 2: Produção (Imagem limpa com apenas o binário JS)
FROM node:25-alpine3.23
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
ENV NODE_ENV=production
EXPOSE 3002 50051
CMD ["node", "dist/core/index.js"]
