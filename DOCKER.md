# Docker Guide for Infokes File Manager

This project is fully dockerized with support for both development and production environments.

## Quick Start

### Development with Docker Compose

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production with Docker Compose

```bash
# Start production setup
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Architecture Overview

### Docker Structure

```
Dockerfile (multi-stage)
├── Stage 1: backend-builder (Bun) - Build backend
├── Stage 2: frontend-builder (Node) - Build frontend
├── Stage 3: backend-runtime (Bun) - Backend service
├── Stage 4: frontend-runtime (Node) - Frontend service
└── Stage 5: production (Node) - Combined production

packages/backend/Dockerfile - Backend development image
packages/frontend/Dockerfile - Frontend development image
```

### Services

#### PostgreSQL (postgres)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Volume**: postgres_data
- **Health**: Native pg_isready check

#### Backend API (backend)
- **Runtime**: Bun 1.3.3 or Node 22
- **Port**: 3000
- **Framework**: Elysia
- **Database**: PostgreSQL
- **Routes**: `/swagger` (health check endpoint)

#### Frontend (frontend)
- **Runtime**: Node 22 Alpine
- **Port**: 5173
- **Framework**: Vue 3 + Vite
- **Server**: Sirv (production) or Vite dev server

## Building Images

### Build All Services

```bash
# Production build (all stages)
docker-compose build

# Development build
docker-compose -f docker-compose.dev.yml build

# Build specific service
docker-compose build backend
docker-compose build frontend
docker-compose build postgres
```

### Build Individual Services Manually

```bash
# Build backend
docker build -t infokes-backend -f packages/backend/Dockerfile .

# Build frontend
docker build -t infokes-frontend -f packages/frontend/Dockerfile .

# Build multi-stage
docker build -t infokes-app -f Dockerfile --target backend-runtime .
docker build -t infokes-app -f Dockerfile --target frontend-runtime .
```

## Environment Variables

### Backend (.env or docker-compose)

```env
NODE_ENV=development|production
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/infokes_db
PORT=3000
```

### Frontend (.env or vite.config.js)

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Health Checks

All services include health checks:

- **Backend**: HTTP GET `/swagger` endpoint
- **Frontend**: HTTP GET to root
- **Database**: `pg_isready` command

View health status:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Volumes

### Development Volumes

```yaml
./packages/backend/src -> /app/packages/backend/src
./packages/backend/tests -> /app/packages/backend/tests
./packages/frontend/src -> /app/packages/frontend/src
./packages/frontend/public -> /app/packages/frontend/public
postgres_data_dev -> /var/lib/postgresql/data
```

### Production Volumes

```yaml
postgres_data -> /var/lib/postgresql/data
```

## Networking

All services use the `infokes-network` bridge network for inter-service communication.

Access within containers:
- Backend: `http://backend:3000`
- Frontend: `http://frontend:5173`
- Database: `postgresql://postgres:postgres@postgres:5432/infokes_db`

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute Commands in Container

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Database CLI
docker-compose exec postgres psql -U postgres -d infokes_db

# Run backend tests
docker-compose exec backend bun test
```

### Clean Up

```bash
# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Deep clean
docker system prune -a --volumes
```

## Debugging

### Check Service Status

```bash
# See all containers
docker ps

# See container details
docker inspect infokes-backend

# View resource usage
docker stats
```

### Test API

```bash
# From host
curl http://localhost:3000/swagger

# From container
docker-compose exec backend curl http://localhost:3000/swagger
```

### Test Database Connection

```bash
# Connect from backend container
docker-compose exec backend bun run -e "
  import pg from 'pg';
  const client = new pg.Client('postgresql://postgres:postgres@postgres:5432/infokes_db');
  await client.connect();
  console.log('Connected!');
  await client.end();
"
```

## Production Deployment

### Build for Production

```bash
# Multi-stage build
docker build -t infokes-app:latest -f Dockerfile --target production .

# Push to registry
docker tag infokes-app:latest your-registry/infokes-app:latest
docker push your-registry/infokes-app:latest
```

### Run Production Container

```bash
docker run -d \
  --name infokes-prod \
  -p 3000:3000 \
  -p 5173:5173 \
  -e DATABASE_URL="postgresql://user:password@db-host:5432/infokes_db" \
  infokes-app:latest
```

### Environment-Specific Compose

For production, customize `docker-compose.yml`:

```yaml
# Use official registry images
image: your-registry/infokes-app:latest

# Configure for production database
DATABASE_URL: postgresql://prod-user:prod-pass@prod-db:5432/prod_db

# Use production environment
NODE_ENV: production

# Add resource limits
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M

# Use health checks for orchestration
restart_policy:
  condition: on-failure
  delay: 5s
  max_attempts: 5
```

## Troubleshooting

### Backend can't connect to database

```bash
# Check if postgres is running and healthy
docker-compose ps

# Check logs
docker-compose logs postgres

# Test connection manually
docker-compose exec backend psql postgresql://postgres:postgres@postgres:5432/infokes_db
```

### Frontend can't connect to backend

```bash
# Verify backend is running on port 3000
docker-compose port backend 3000

# Check frontend logs
docker-compose logs frontend

# Test from frontend container
docker-compose exec frontend curl http://backend:3000/swagger
```

### Port already in use

```bash
# Kill existing container
docker-compose down

# Use different ports (edit docker-compose.yml)
ports:
  - "8000:3000"  # Backend
  - "8080:5173"  # Frontend
```

### Build cache issues

```bash
# Rebuild without cache
docker-compose build --no-cache

# Clear build cache
docker builder prune -a
```

## Performance Tips

1. **Use multi-stage builds** - Reduces final image size
2. **Leverage build cache** - Order Dockerfile commands by change frequency
3. **Use Alpine images** - Smaller base images (postgres:16-alpine, node:22-alpine)
4. **Minimize layers** - Combine RUN commands with &&
5. **Use .dockerignore** - Exclude unnecessary files
6. **Resource limits** - Set memory/CPU limits in docker-compose
7. **Named volumes** - Persist data efficiently

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Bun Docker Images](https://hub.docker.com/r/oven/bun)
- [PostgreSQL Docker Images](https://hub.docker.com/_/postgres)
- [Node.js Docker Images](https://hub.docker.com/_/node)
