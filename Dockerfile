FROM node:16.13.0-alpine AS builder
RUN apk add --update libc6-compat openssl openssl-dev
WORKDIR /app
COPY . .
RUN npm install --global pnpm@7.13.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm --filter \!expo install turbo
RUN NEXT_PUBLIC_APP_URL=https://bangeralert.davidapps.dev pnpm build:web

FROM node:16.13.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]