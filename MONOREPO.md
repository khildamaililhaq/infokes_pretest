# Infokes Pretest - Monorepo Structure

## Overview

This is a **monorepo** project using npm workspaces, containing a full-stack file manager application with a backend API and frontend UI.

## Project Structure

```
infokes-pretest/
├── package.json                 # Root package.json with workspace config
├── .npmrc                       # NPM workspace configuration
├── .gitignore
├── README.md
├── packages/
│   ├── backend/                # Backend API (Bun + Elysia + TypeORM)
│   │   ├── src/
│   │   │   ├── index.ts         # Server entry point
│   │   │   ├── controllers/     # API route handlers
│   │   │   ├── services/        # Business logic
│   │   │   ├── repositories/    # Data access layer
│   │   │   └── entities/        # Database entities
│   │   ├── tests/               # Test files
│   │   ├── package.json         # Backend dependencies
│   │   └── tsconfig.json
│   │
│   └── frontend/                # Frontend UI (Vue 3 + Vite)
│       ├── src/
│       │   ├── main.js          # App entry point
│       │   ├── App.vue          # Root component
│       │   ├── views/           # Page components
│       │   ├── components/      # Reusable components
│       │   ├── composables/     # Vue composables
│       │   ├── services/        # API clients
│       │   ├── router/          # Vue Router config
│       │   └── assets/          # Static files
│       ├── tests/               # Test files
│       ├── package.json         # Frontend dependencies
│       ├── vite.config.js       # Vite configuration
│       └── jsconfig.json
```

## Getting Started

### Prerequisites

- **Node.js**: v20.19+ or v22.12+
- **Bun**: v1.3.3+
- **npm**: v8+

### Installation

```bash
# From root directory
npm install

# This will install dependencies for both packages automatically
```

### Running Development Servers

**Start both backend and frontend:**
```bash
npm run start
```

**Start backend only:**
```bash
npm run start:backend
```

**Start frontend only:**
```bash
npm run start:frontend
```

**Frontend dev server:** http://localhost:5173  
**Backend API:** http://localhost:3000  
**API Documentation (Swagger):** http://localhost:3000/docs

### Running Tests

**Test all packages:**
```bash
npm run test
```

**Test with watch mode:**
```bash
npm run test:watch
```

**Test specific package:**
```bash
npm run test --workspace=@infokes/backend
npm run test --workspace=@infokes/frontend
```

### Building

**Build all packages:**
```bash
npm run build
```

**Build specific package:**
```bash
npm run build --workspace=@infokes/frontend
```

### Cleanup

**Remove all node_modules and build artifacts:**
```bash
npm run clean
```

## Package Information

### Backend (`@infokes/backend`)

**Technology Stack:**
- Runtime: Bun 1.3.3
- Framework: Elysia
- Database: PostgreSQL + TypeORM
- Middleware: CORS, Swagger

**Key Features:**
- REST API with complete CRUD operations
- Hierarchical folder structure (tree view)
- File management in folders
- TypeScript support
- Swagger API documentation

**API Endpoints:**
- `GET /folders/tree` - Get folder hierarchy
- `GET /folders` - Get all folders
- `GET /files` - Get all files
- `POST /folders` - Create folder
- `PATCH /folders/:id` - Update folder
- `DELETE /folders/:id` - Delete folder
- `POST /files` - Create file
- `PATCH /files/:id` - Update file
- `DELETE /files/:id` - Delete file

**Tests:** 28/28 passing

### Frontend (`@infokes/frontend`)

**Technology Stack:**
- Framework: Vue 3 (Composition API)
- Build Tool: Vite 7.2.4
- Router: Vue Router 4.6.3
- Runtime: Bun 1.3.3

**Key Features:**
- Windows Explorer-style sidebar with tree view
- Right-click context menus
- Folder navigation with breadcrumbs
- Create/Edit/Delete folders and files
- Responsive UI with Tailwind-like styling
- Service layer for API communication

**Components:**
- **Sidebar** - Folder tree navigation
- **TreeFolder** - Recursive folder component
- **FolderList** - Display folders in content area
- **FileList** - Display files in content area
- **Breadcrumb** - Navigation breadcrumbs
- **ContextMenu** - Right-click menus
- **EmptyState** - Empty content state

**Composables:**
- `useFolders()` - Folder operations
- `useFiles()` - File operations
- `useContextMenu()` - Context menu state management

**Tests:** 11/11 service tests passing

## Workspace Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies for all packages |
| `npm run dev` | Run dev servers for all packages |
| `npm run build` | Build all packages |
| `npm run test` | Run tests for all packages |
| `npm run start:backend` | Start backend only |
| `npm run start:frontend` | Start frontend only |
| `npm run start` | Start both servers simultaneously |
| `npm run clean` | Remove all build artifacts |

## Working with Workspaces

### Installing Dependencies

**For all packages:**
```bash
npm install
```

**For specific package:**
```bash
npm install --workspace=@infokes/backend lodash
```

### Running Scripts

**Run script in specific package:**
```bash
npm run test --workspace=@infokes/backend
```

**Run script in all packages:**
```bash
npm run test --workspaces
```

## Development Workflow

1. **Make changes** in `packages/backend/` or `packages/frontend/`
2. **Run dev servers** with `npm run start:backend` and `npm run start:frontend`
3. **Test changes** with `npm run test --workspace=<package-name>`
4. **Build for production** with `npm run build --workspace=<package-name>`

## Database Configuration

Backend uses PostgreSQL. Set environment variables or update connection in `packages/backend/src/database.ts`:

```typescript
host: 'localhost'
port: 5432
username: 'your_user'
password: 'your_password'
database: 'file_manager'
```

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

**Clear cache:**
```bash
npm run clean
npm install
```

**Node version mismatch:**
```bash
nvm use 22  # or your required version
```

## Contributing

1. Create feature branch from main
2. Make changes in appropriate package
3. Run tests: `npm run test`
4. Commit with clear messages
5. Push and create pull request

## License

MIT

## Support

For issues or questions, check the individual package READMEs:
- Backend: `packages/backend/README.md`
- Frontend: `packages/frontend/README.md`
