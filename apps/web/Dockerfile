FROM node:20-alpine AS base

FROM base AS builder

WORKDIR /app
COPY . .
RUN npm install && \
    npm run build

FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE $PORT
ENV HOST=0.0.0.0

CMD ["npm", "start"]
