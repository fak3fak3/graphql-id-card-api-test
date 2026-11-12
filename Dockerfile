# syntax=docker/dockerfile:1

# ---- base: one Node version for every stage -------------------------------
FROM node:24-slim AS base
WORKDIR /app

# ---- deps: full dependency tree, needed only to compile --------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ---- build: TypeScript -> dist ---------------------------------------------
FROM deps AS build
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# ---- prod-deps: runtime dependencies only ----------------------------------
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# ---- runtime: compiled code + production dependencies, non-root ------------
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

USER node
EXPOSE 3000

# The slim image has no curl/wget, so the probe uses Node's built-in fetch.
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
  CMD ["node", "-e", "fetch(`http://127.0.0.1:${process.env.PORT}/health`).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

# Node runs directly (no npm wrapper) so it receives SIGTERM itself.
CMD ["node", "dist/main"]
