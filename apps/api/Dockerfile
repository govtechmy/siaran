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
# due to React version mismatch (api-doc, @govtechmy/myds-react)
RUN npm install --force
COPY --from=builder /app/out/full/ .
RUN npm install turbo --global
RUN turbo build --filter=api

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express
COPY --from=installer --chown=express:nodejs /app/ .
COPY --from=installer /app/ .

USER express
EXPOSE $PORT
ENV HOST=0.0.0.0

CMD ["npm", "start", "--workspace=api"]