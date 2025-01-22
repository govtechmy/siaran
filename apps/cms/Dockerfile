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
RUN npm install
COPY --from=builder /app/out/full/ .
# Provide build-time environment variables
ARG PAYLOAD_PUBLIC_WEBHOOK_API_HOST
ENV PAYLOAD_PUBLIC_WEBHOOK_API_HOST=${PAYLOAD_PUBLIC_WEBHOOK_API_HOST}
ARG SERVICE_DATABASE
ENV SERVICE_DATABASE=${SERVICE_DATABASE}
RUN npm install turbo --global
# install missing 'express' for hoisted '@payloadcms/webpack-bundler' in the root directory
RUN npm install express
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
