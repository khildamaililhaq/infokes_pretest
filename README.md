# Infokes Pretest - File Manager Application

A modern, full-stack file manager with Vue 3 frontend and Elysia backend, fully containerized with Docker.

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker & Docker Compose installed
- No Node.js required (everything runs in containers)

### Start Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd infokes-pretest

# Start all services with Docker
./docker-helper.sh dev:start
```

That's it! Services will be available at:
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:3001
- **API Docs:** http://localhost:3001/docs
- **PostgreSQL:** localhost:5433 (user: postgres, pass: postgres)

### Common Docker Commands

```bash
# Start development environment
./docker-helper.sh dev:start

# Stop services
./docker-helper.sh dev:stop

# View logs
./docker-helper.sh dev:logs

# Access backend shell
./docker-helper.sh dev:shell

# Access PostgreSQL
./docker-helper.sh dev:db

# Show container status
./docker-helper.sh status

# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v
```

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Node.js v22+ or Bun v1.3.3+
- PostgreSQL 16+

### Setup

```bash
# Install dependencies
npm install

# Start backend
npm run start:backend

# In another terminal, start frontend
npm run start:frontend
```

Services will be available at:
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:3001

## 📁 Project Structure

```
infokes-pretest/
├── packages/
│   ├── backend/        # Elysia + TypeORM API server
│   └── frontend/       # Vue 3 + Vite UI application
├── docker-compose.dev.yml  # Development stack
├── Dockerfile          # Multi-stage production build
└── docker-helper.sh    # Helper script for Docker commands
```

## ✨ Features

- ✅ Create, read, update, delete folders and files
- ✅ Hierarchical folder structure with tree navigation
- ✅ Context menus and breadcrumb navigation
- ✅ RESTful API with Swagger documentation
- ✅ PostgreSQL database with TypeORM
- ✅ Vue 3 with Composition API
- ✅ Fully containerized with Docker
- ✅ Hot-reload in development mode

## 📚 Additional Documentation

- [MONOREPO.md](./MONOREPO.md) - Monorepo structure and configuration
- [DOCKER.md](./DOCKER.md) - Detailed Docker setup and deployment
- [packages/backend/README.md](./packages/backend/README.md) - Backend API details
- [packages/frontend/README.md](./packages/frontend/README.md) - Frontend UI details

## 🐳 Docker Architecture

### Development Stack (docker-compose.dev.yml)
- **PostgreSQL 16:** Database (port 5433)
- **Backend:** Elysia server with hot-reload (port 3001)
- **Frontend:** Vite dev server with HMR (port 5174)

All services run in a shared Docker network and persist data to volumes.

### Production Build (Dockerfile)
- Multi-stage build for optimized image size
- Bun runtime for both backend and frontend
- Static frontend bundle with production API endpoint

## 🔧 Configuration

### Environment Variables

Create `.env` in the root directory:

```env
# Backend
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=infokes_db
NODE_ENV=development
PORT=3000

# Frontend
VITE_API_BASE_URL=http://localhost:3001
```

### Database

- **Type:** PostgreSQL 16
- **Dev Database:** infokes_db
- **Dev Port:** 5433 (on host), 5432 (in Docker network)
- **Auto-migration:** Enabled in development

## 🚀 Deployment

### Docker Compose (Production-like)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop and clean up
docker-compose down -v
```

## 📝 Common Tasks

### Create a new folder via API

```bash
curl -X POST http://localhost:3001/folders \
  -H "Content-Type: application/json" \
  -d '{"name":"My Folder","description":"Test folder"}'
```

### View API Documentation

Open http://localhost:3001/docs in your browser for interactive Swagger UI.

### Access Database

```bash
./docker-helper.sh dev:db
# Or manually:
psql -h localhost -p 5433 -U postgres -d infokes_db
```

## 🐛 Troubleshooting

### Containers won't start
```bash
# Clean up and restart
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Port already in use
```bash
# Kill process on port
lsof -ti:5174 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:5433 | xargs kill -9  # Database
```

### Frontend can't reach backend
- Ensure backend is healthy: `docker-compose -f docker-compose.dev.yml ps`
- Check backend logs: `docker logs infokes-backend-dev`
- Verify API URL is set to `http://localhost:3001`

## 📄 License

MIT

---

**Get started now:** `./docker-helper.sh dev:start` 🚀
