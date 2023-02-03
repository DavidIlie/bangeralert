FROM node:16.13.0-alpine AS builder
RUN apk add --update libc6-compat openssl openssl-dev
WORKDIR /app
COPY . .
RUN npm install --global pnpm@7.13.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm --filter \!expo install turbo
RUN NEXT_PUBLIC_APP_URL=https://bangeralert.davidapps.dev SKIP_ENV_VALIDATION=true pnpm build:web
EXPOSE 3000
WORKDIR /app/apps/web
CMD [ "npm", "run", "start" ]