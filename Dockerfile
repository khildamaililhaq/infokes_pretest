# Multi-stage build for the monorepo

# Stage 1: Backend builder
FROM oven/bun:1.3.3-alpine AS backend-builder
WORKDIR /app

# Copy root package files
COPY package.json .npmrc ./

# Copy backend package
COPY packages/backend ./packages/backend

# Install dependencies
RUN npm install --workspace=backend

# Build backend (if needed)
RUN cd packages/backend && bun run build 2>/dev/null || true

# Stage 2: Frontend builder
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# Copy root package files
COPY package.json .npmrc ./

# Copy frontend package
COPY packages/frontend ./packages/frontend

# Install dependencies
RUN npm install --workspace=frontend

# Build frontend
RUN npm run build --workspace=frontend

# Stage 3: Backend runtime
FROM oven/bun:1.3.3-alpine AS backend-runtime
WORKDIR /app

# Copy root package files
COPY package.json .npmrc ./

# Copy backend package
COPY packages/backend ./packages/backend

# Install only production dependencies
RUN npm install --workspace=backend --omit=dev

# Expose backend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000/swagger').then(() => process.exit(0)).catch(() => process.exit(1))" || exit 1

# Start backend
CMD ["npm", "run", "--workspace=backend", "start"]

# Stage 4: Frontend runtime
FROM node:22-alpine AS frontend-runtime
WORKDIR /app

# Install lightweight web server
RUN npm install -g sirv-cli

# Copy built frontend from builder
COPY --from=frontend-builder /app/packages/frontend/dist ./

# Expose frontend port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173 || exit 1

# Start frontend
CMD ["sirv", ".", "--single", "--port", "5173"]

# Stage 5: Production-ready combined (optional)
FROM node:22-alpine AS production
WORKDIR /app

# Copy root config
COPY package.json .npmrc ./

# Copy backend
COPY packages/backend ./packages/backend
RUN npm install --workspace=backend --omit=dev

# Copy frontend dist
COPY --from=frontend-builder /app/packages/frontend/dist ./public

# Install sirv for serving frontend
RUN npm install -g sirv-cli

EXPOSE 3000 5173

# Start both services
CMD ["sh", "-c", "npm run --workspace=backend start & sirv ./public --single --port 5173"]
