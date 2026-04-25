# syntax=docker/dockerfile:1.7

# ---------- deps (install with build toolchain for native modules) ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++ vips-dev
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit --no-fund

# ---------- build (compile admin panel + TS sources) ----------
FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat vips-dev
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Placeholder secrets so `strapi build` can bootstrap config validation.
# Real values come from runtime env in the runner stage.
RUN APP_KEYS="build,build,build,build" \
    API_TOKEN_SALT=build \
    ADMIN_JWT_SECRET=build \
    TRANSFER_TOKEN_SALT=build \
    JWT_SECRET=build \
    ENCRYPTION_KEY=build \
    npm run build && \
    npm prune --omit=dev

# ---------- runner (slim runtime) ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache tini vips curl
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337

# Run as non-root.
RUN addgroup -S strapi && adduser -S strapi -G strapi

COPY --from=build --chown=strapi:strapi /app/node_modules ./node_modules
COPY --from=build --chown=strapi:strapi /app/package.json ./package.json
COPY --from=build --chown=strapi:strapi /app/dist ./dist
COPY --from=build --chown=strapi:strapi /app/config ./config
COPY --from=build --chown=strapi:strapi /app/src ./src
COPY --from=build --chown=strapi:strapi /app/database ./database
COPY --from=build --chown=strapi:strapi /app/public ./public
COPY --from=build --chown=strapi:strapi /app/favicon.png ./favicon.png
COPY --from=build --chown=strapi:strapi /app/tsconfig.json ./tsconfig.json
COPY --from=build --chown=strapi:strapi /app/types ./types

USER strapi
EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -fsS http://localhost:1337/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start"]
