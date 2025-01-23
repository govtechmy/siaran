FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache gcompat
WORKDIR /app
COPY . .
RUN npm install turbo --global
RUN turbo prune web --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN npm install
COPY --from=builder /app/out/full/ .
RUN npm install turbo --global
RUN turbo build --filter=web

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=installer --chown=nextjs:nodejs /app/ .

USER nextjs
EXPOSE $PORT
ENV HOST=0.0.0.0

CMD ["npm", "start", "--workspace=web"]
