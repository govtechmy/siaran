FROM node:18.8-alpine AS base

FROM base AS builder
RUN apk add --no-cache gcompat
WORKDIR /app
COPY . .
RUN npm install turbo --global
RUN turbo prune cms --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
# due to React version mismatch (api-doc, @govtechmy/myds-react)
RUN npm install --force
COPY --from=builder /app/out/full/ .
# Provide build-time environment variables
ARG PAYLOAD_PUBLIC_WEBHOOK_API_HOST
ENV PAYLOAD_PUBLIC_WEBHOOK_API_HOST=${PAYLOAD_PUBLIC_WEBHOOK_API_HOST}
# install missing 'express' for hoisted '@payloadcms/webpack-bundler' in the root directory
RUN npm install express
RUN npm install turbo --global
RUN turbo build --filter=cms

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express
COPY --from=installer /app .

USER express
EXPOSE $PORT
ENV HOST=0.0.0.0

CMD ["npm", "start", "--workspace=cms"]
