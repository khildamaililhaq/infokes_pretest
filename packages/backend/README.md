# Backend API - @infokes/backend

Bun-based REST API for file manager application with TypeORM and PostgreSQL.

## 🚀 Quick Start

```bash
# From monorepo root
npm run start:backend

# Or from backend directory
cd packages/backend
bun run dev
```

Server runs at: **http://localhost:3000**  
Swagger Docs: **http://localhost:3000/docs**

## 📋 Features

- ✅ Complete CRUD for folders and files
- ✅ Hierarchical folder tree structure
- ✅ CORS enabled for frontend communication
- ✅ Swagger API documentation
- ✅ TypeScript support
- ✅ 28/28 tests passing

## 🏗️ Architecture

```
src/
├── index.ts              # Server setup & middleware
├── controllers/          # Route handlers
│   ├── folderController.ts
│   └── fileController.ts
├── services/             # Business logic
│   ├── FolderService.ts
│   └── FileService.ts
├── repositories/         # Data access layer
│   ├── FolderRepository.ts
│   └── FileRepository.ts
└── entities/             # Database models
    ├── Folder.ts
    └── File.ts
```

## 📦 Dependencies

**Production:**
- `elysia` - Web framework
- `typeorm` - ORM
- `pg` - PostgreSQL driver
- `@elysiajs/cors` - CORS middleware
- `@elysiajs/swagger` - Swagger documentation
- `reflect-metadata` - TypeScript decorators

**Development:**
- `bun` - Runtime & package manager
- `@types/bun` - Type definitions
- `@types/pg` - PostgreSQL types

## 🛣️ API Endpoints

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/folders/tree` | Get hierarchical folder structure |
| GET | `/folders` | Get all folders |
| GET | `/folders/root` | Get root-level folders |
| GET | `/folders/:id` | Get folder by ID |
| GET | `/folders/:id/contents` | Get folder with subfolders and files |
| POST | `/folders` | Create folder |
| PATCH | `/folders/:id` | Update folder |
| DELETE | `/folders/:id` | Delete folder |

### Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files` | Get all files |
| GET | `/files/:id` | Get file by ID |
| POST | `/files` | Create file |
| PATCH | `/files/:id` | Update file |
| DELETE | `/files/:id` | Delete file |
| POST | `/files/:id/move` | Move file to different folder |

## 📝 API Examples

### Create Folder
```bash
curl -X POST http://localhost:3000/folders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Folder",
    "description": "Optional description",
    "parentId": "parent-id-or-null"
  }'
```

### Get Folder Tree
```bash
curl http://localhost:3000/folders/tree
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "folder-id",
      "name": "Root Folder",
      "description": "...",
      "parentId": null,
      "children": [
        {
          "id": "child-id",
          "name": "Subfolder",
          "children": []
        }
      ]
    }
  ]
}
```

### Create File
```bash
curl -X POST http://localhost:3000/files \
  -H "Content-Type: application/json" \
  -d '{
    "name": "document",
    "extension": "txt",
    "content": "File content",
    "mimeType": "text/plain",
    "folderId": "folder-id-or-null"
  }'
```

## 🧪 Testing

```bash
# Run all tests
npm run test --workspace=@infokes/backend

# Watch mode
npm run test:watch --workspace=@infokes/backend

# From backend directory
cd packages/backend
bun test
```

**Test Coverage:** 28/28 tests passing
- FolderService: 13 tests
- FileService: 15 tests

## 🗄️ Database

### Connection
- **Host:** localhost
- **Port:** 5432
- **Database:** file_manager
- **User:** postgres

### Setup
1. Create PostgreSQL database
2. Update connection in `src/index.ts`
3. Migrations run automatically on startup

### Schema

**folders table:**
```sql
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  parentId UUID REFERENCES folders(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**files table:**
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  extension VARCHAR,
  size INTEGER,
  content TEXT,
  mimeType VARCHAR,
  folderId UUID REFERENCES folders(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Important Notes

### Root Folders
- Folders/files without `parentId`/`folderId` belong to **root**
- Omit the ID to create in root level

### Hierarchy
- Tree structure loads all folders in single call
- Maximum depth is unlimited
- Cascade delete removes all children

### Error Handling
All endpoints return:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🚀 Scripts

```bash
npm run start          # Production start
npm run dev            # Development with watch
npm run test           # Run tests
npm run test:watch     # Tests with watch
```

## 📚 Related Documentation

- [Main README](../../README.md)
- [Monorepo Guide](../../MONOREPO.md)
- [Frontend Documentation](../frontend/README.md)

## 🤝 Contributing

1. Make changes in `src/`
2. Write tests in `tests/`
3. Run `npm run test` before committing
4. All tests must pass

## 📄 License

MIT

4. Create the database:
```bash
# Using psql
psql -U postgres -c "CREATE DATABASE filemanager;"
```

## Running the Application

### Development mode with auto-reload:
```bash
bun run dev
```

### Production mode:
```bash
bun run start
```

The server will start at `http://localhost:3000`

## API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/docs
```

## API Endpoints

### Folders

- `GET /folders` - Get all folders
- `GET /folders/root` - Get root folders (no parent)
- `GET /folders/:id` - Get folder by ID
- `GET /folders/:id/contents` - Get folder with its subfolders and files
- `POST /folders` - Create a new folder
- `PATCH /folders/:id` - Update folder
- `DELETE /folders/:id` - Delete folder (cascades to children)

### Files

- `GET /files` - Get all files
- `GET /files/:id` - Get file by ID
- `POST /files` - Create a new file
- `PATCH /files/:id` - Update file
- `DELETE /files/:id` - Delete file
- `POST /files/:id/move` - Move file to different folder

## Request Examples

### Create a folder:
```bash
curl -X POST http://localhost:3000/folders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Documents",
    "description": "Personal documents folder"
  }'
```

### Create a subfolder:
```bash
curl -X POST http://localhost:3000/folders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work",
    "description": "Work documents",
    "parentId": "<parent-folder-id>"
  }'
```

### Create a file:
```bash
curl -X POST http://localhost:3000/files \
  -H "Content-Type: application/json" \
  -d '{
    "name": "document.txt",
    "extension": "txt",
    "content": "Hello World",
    "mimeType": "text/plain",
    "size": 11,
    "folderId": "<folder-id>"
  }'
```

### Update a folder:
```bash
curl -X PATCH http://localhost:3000/folders/<folder-id> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Folder Name",
    "description": "New description"
  }'
```

### Move a file:
```bash
curl -X POST http://localhost:3000/files/<file-id>/move \
  -H "Content-Type: application/json" \
  -d '{
    "folderId": "<new-folder-id>"
  }'
```

## Running Tests

### Run all tests:
```bash
bun test
```

### Run tests in watch mode:
```bash
bun run test:watch
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── entities/
│   │   ├── Folder.ts            # Folder entity/model
│   │   └── File.ts              # File entity/model
│   ├── repositories/
│   │   ├── FolderRepository.ts  # Folder data access
│   │   └── FileRepository.ts    # File data access
│   ├── services/
│   │   ├── FolderService.ts     # Folder business logic
│   │   └── FileService.ts       # File business logic
│   ├── controllers/
│   │   ├── folderController.ts  # Folder API routes
│   │   └── fileController.ts    # File API routes
│   └── index.ts                 # Application entry point
├── tests/
│   ├── FolderService.test.ts    # Folder service tests
│   └── FileService.test.ts      # File service tests
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

### Folders Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR 255)
- `description` (TEXT, nullable)
- `parentId` (UUID, nullable, Foreign Key to Folders)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Files Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR 255)
- `extension` (VARCHAR 100, nullable)
- `size` (BIGINT)
- `content` (TEXT, nullable)
- `mimeType` (VARCHAR 100, nullable)
- `folderId` (UUID, nullable, Foreign Key to Folders)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Features Explained

### Hierarchical Folder Structure
Folders can have parent-child relationships, allowing you to create nested folder structures like traditional file systems.

### Cascade Deletion
When you delete a folder, all its subfolders and files are automatically deleted (ON DELETE CASCADE).

### Validation
- Folder and file names are required and cannot be empty
- Parent folder must exist when creating a subfolder
- Prevents circular references (folder cannot be its own parent)
- File folder must exist when specified

### Error Handling
All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_DATABASE` | Database name | `filemanager` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## Troubleshooting

### Database connection errors
1. Ensure PostgreSQL is running
2. Verify credentials in `.env` file
3. Check if database exists: `psql -U postgres -l`

### Port already in use
Change the `PORT` in `.env` file to a different port

### TypeORM synchronization issues
In development, `synchronize: true` automatically creates/updates tables. For production, use migrations instead.

## License

MIT
