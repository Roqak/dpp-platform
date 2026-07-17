FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

EXPOSE 3010

ENV NITRO_PORT=3010
ENV NUXT_PUBLIC_API_BASE=http://api:3011/api/v1

CMD ["node", ".output/server/index.mjs"]
