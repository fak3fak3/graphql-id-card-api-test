# syntax=docker/dockerfile:1

# ---- base: one Node version for every stage -------------------------------
FROM node:24-slim AS base
WORKDIR /app
# Prisma's engines link against OpenSSL, which the slim image does not ship.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# ---- deps: full dependency tree, needed only to compile --------------------
# The Prisma schema is copied first because `npm ci` runs `prisma generate`
# (postinstall), which writes the typed client to src/generated.
FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm npm ci

# ---- build: TypeScript -> dist ---------------------------------------------
FROM deps AS build
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# ---- prod-deps: runtime dependencies only ----------------------------------
# Includes the Prisma CLI: the same image applies migrations and runs the seed.
FROM base AS prod-deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# ---- runtime: compiled code + production dependencies, non-root ------------
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    NPM_CONFIG_UPDATE_NOTIFIER=false

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
# Needed by `prisma migrate deploy` / `prisma db seed`, not by the app itself.
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node package.json prisma.config.ts ./

USER node
EXPOSE 3000

# The slim image has no curl/wget, so the probe uses Node's built-in fetch.
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
  CMD ["node", "-e", "fetch(`http://127.0.0.1:${process.env.PORT}/health`).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

# Node runs directly (no npm wrapper) so it receives SIGTERM itself.
CMD ["node", "dist/main"]
