FROM node:22-alpine

WORKDIR /app

# Copy root package files
COPY package.json .npmrc ./

# Copy frontend package
COPY packages/frontend ./packages/frontend

# Install dependencies
RUN npm install --workspace=frontend

EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173 || exit 1

# Start frontend in dev mode
CMD ["npm", "run", "--workspace=frontend", "dev", "--", "--host"]
