# Multi-stage build for the monorepo - using Bun for all

# Stage 1: Builder (both backend and frontend)
FROM oven/bun:1.3.3-alpine AS builder
WORKDIR /app

# Copy root package files
COPY package.json .npmrc ./

# Copy all packages
COPY packages ./packages

# Install dependencies using bun (skip dev dependencies for frontend vitest issue)
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# Build backend (if needed)
RUN cd packages/backend && bun run build 2>/dev/null || true

# Build frontend
RUN cd packages/frontend && bun run build

# Stage 2: Backend runtime
FROM oven/bun:1.3.3-alpine AS backend-runtime
WORKDIR /app

# Copy node_modules and backend from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend ./packages/backend

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000/swagger').then(() => process.exit(0)).catch(() => process.exit(1))" || exit 1

# Start backend
CMD ["bun", "run", "packages/backend/src/index.ts"]

# Stage 3: Frontend runtime
FROM oven/bun:1.3.3-alpine AS frontend-runtime
WORKDIR /app

# Install sirv
RUN bun add -g sirv-cli

# Copy built frontend from builder
COPY --from=builder /app/packages/frontend/dist ./

EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173 || exit 1

# Start frontend
CMD ["sirv", ".", "--single", "--port", "5173"]

# Stage 4: Production (combined)
FROM oven/bun:1.3.3-alpine AS production
WORKDIR /app

# Install sirv globally
RUN bun add -g sirv-cli

# Copy node_modules and backend from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend ./packages/backend

# Copy frontend dist
COPY --from=builder /app/packages/frontend/dist ./public

EXPOSE 3000 5173

# Start backend with frontend
CMD ["sh", "-c", "bun run packages/backend/src/index.ts & sirv ./public --single --port 5173"]
