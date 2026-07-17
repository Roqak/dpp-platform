FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY . .
RUN pnpm build

EXPOSE 3011

CMD ["node", "dist/main"]
