FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache gcompat
WORKDIR /app
COPY . .
RUN npm install turbo --global
RUN turbo prune api --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN npm install
COPY --from=builder /app/out/full/ .
RUN npm install -g turbo
RUN turbo build --filter=api

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express
COPY --from=installer --chown=express:nodejs /app/ .

USER express
EXPOSE $PORT
ENV HOST=0.0.0.0

CMD ["node", "./apps/api/dist/index.js"]