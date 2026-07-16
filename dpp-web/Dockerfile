FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3010

ENV NITRO_PORT=3010
ENV NUXT_PUBLIC_API_BASE=http://localhost:3001/api/v1

CMD ["node", ".output/server/index.mjs"]
