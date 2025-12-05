FROM oven/bun:1.3.3-alpine

WORKDIR /app

# Copy root package files
COPY package.json .npmrc ./

# Copy backend package
COPY packages/backend ./packages/backend

# Install dependencies
RUN npm install --workspace=backend

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000/swagger').then(() => process.exit(0)).catch(() => process.exit(1))" || exit 1

# Start backend
CMD ["npm", "run", "--workspace=backend", "dev"]
