# Infokes Pretest - File Manager Application

A modern, full-stack file manager application with a backend API and intuitive frontend UI.

## 🏗️ Architecture

This project uses a **monorepo structure** with npm workspaces, organized as follows:

```
infokes-pretest/
├── packages/
│   ├── backend/    # Bun + Elysia + TypeORM API
│   └── frontend/   # Vue 3 + Vite UI
├── MONOREPO.md     # Detailed monorepo documentation
└── package.json    # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js v20.19+ or v22.12+
- Bun v1.3.3+

### Installation & Setup

```bash
# Clone repository
git clone <repository-url>
cd infokes-pretest

# Install dependencies
npm install

# Start development servers
npm run start

# Or start individually:
npm run start:backend   # Backend at http://localhost:3000
npm run start:frontend  # Frontend at http://localhost:5173
```

## 📚 Documentation

- **[MONOREPO.md](./MONOREPO.md)** - Complete monorepo guide, structure, and workspace management
- **[packages/backend/README.md](./packages/backend/README.md)** - Backend API documentation
- **[packages/frontend/README.md](./packages/frontend/README.md)** - Frontend UI documentation

## 📦 Packages

### Backend (`@infokes/backend`)
- **Framework:** Elysia
- **Database:** PostgreSQL + TypeORM
- **Runtime:** Bun 1.3.3
- **Features:** REST API, CORS, Swagger docs
- **Tests:** 28/28 passing

API Docs: http://localhost:3000/docs

### Frontend (`@infokes/frontend`)
- **Framework:** Vue 3 (Composition API)
- **Build:** Vite 7.2.4
- **Runtime:** Bun 1.3.3
- **UI Features:** Tree view sidebar, context menus, breadcrumbs
- **Tests:** 11/11 passing

App: http://localhost:5173

## 🛠️ Common Commands

```bash
# Development
npm run start              # Start all servers
npm run start:backend      # Start backend only
npm run start:frontend     # Start frontend only

# Testing
npm run test              # Test all packages
npm run test:watch        # Test with watch mode

# Building
npm run build             # Build all packages

# Cleanup
npm run clean             # Remove all artifacts
```

## 📋 Features

### File Manager
- ✅ Create, read, update, delete folders
- ✅ Create, read, update, delete files
- ✅ Hierarchical folder structure
- ✅ Right-click context menus
- ✅ Folder tree navigation
- ✅ Breadcrumb navigation
- ✅ Empty state handling

### API
- ✅ RESTful endpoints
- ✅ CORS enabled
- ✅ Swagger documentation
- ✅ TypeScript support
- ✅ Database migrations

### Frontend
- ✅ Vue 3 Composition API
- ✅ Vue Router integration
- ✅ Reusable components
- ✅ Service layer architecture
- ✅ Responsive design

## 🗂️ Folder Structure

```
infokes-pretest/
├── package.json                      # Root workspace config
├── .npmrc                            # NPM workspace settings
├── MONOREPO.md                       # Monorepo documentation
├── README.md                         # This file
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── index.ts              # Server entry
│   │   │   ├── controllers/          # Route handlers
│   │   │   ├── services/             # Business logic
│   │   │   ├── repositories/         # Data access
│   │   │   └── entities/             # DB models
│   │   ├── tests/                    # Test files
│   │   └── package.json
│   │
│   └── frontend/
│       ├── src/
│       │   ├── main.js               # App entry
│       │   ├── views/                # Pages
│       │   ├── components/           # UI components
│       │   ├── composables/          # Vue hooks
│       │   ├── services/             # API clients
│       │   └── router/               # Routing
│       ├── tests/                    # Test files
│       └── package.json
```

## 🧪 Testing

```bash
# Test all packages
npm run test

# Test specific package
npm run test --workspace=@infokes/backend
npm run test --workspace=@infokes/frontend

# Watch mode
npm run test:watch
```

## 🔧 Configuration

### Backend
- Database: PostgreSQL (localhost:5432)
- Server: http://localhost:3000
- Swagger Docs: http://localhost:3000/docs

### Frontend
- Build Tool: Vite
- Dev Server: http://localhost:5173
- Node: v20.19+ or v22.12+

## 📝 Development Notes

- This is a monorepo using npm workspaces
- Each package is independent but part of the same project
- Backend and frontend can be deployed separately
- Use workspace commands for package-specific operations

## 🚨 Troubleshooting

**Port already in use?**
```bash
# Kill backend (port 3000)
lsof -ti:3000 | xargs kill -9

# Kill frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

**Node version issues?**
```bash
nvm use 22  # Switch to Node 22
npm install
```

**Dependencies not installing?**
```bash
npm run clean
npm install
```

## 📄 License

MIT

## 👤 Author

Infokes Pretest Team

---

**Need more details?** Check [MONOREPO.md](./MONOREPO.md) for comprehensive documentation.
