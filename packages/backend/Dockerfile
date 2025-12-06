FROM oven/bun:1.3.3-alpine

WORKDIR /app

# Copy root package files
COPY package.json .npmrc ./

# Copy backend package
COPY packages/backend ./packages/backend

# Install all dependencies using bun
RUN bun install

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000/').then(() => process.exit(0)).catch(() => process.exit(1))" || exit 1

# Start backend in dev mode with hot reload
CMD ["bun", "run", "--watch", "packages/backend/src/index.ts"]
