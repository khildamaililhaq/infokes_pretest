# File Manager API Backend

A RESTful API for managing files and folders with PostgreSQL database, built with Bun, Elysia, and TypeORM.

## Features

- ✅ **Folder Management**: Create, read, update, delete folders with hierarchical structure
- ✅ **File Management**: Create, read, update, delete, and move files
- ✅ **PostgreSQL Database**: Robust data persistence with TypeORM
- ✅ **Swagger Documentation**: Auto-generated API documentation
- ✅ **Unit Tests**: Comprehensive test coverage with Bun's testing framework
- ✅ **TypeScript**: Full type safety
- ✅ **Cascade Deletes**: Automatically delete child folders and files when parent is deleted

## Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Documentation**: @elysiajs/swagger
- **Testing**: Bun:test

## Prerequisites

- Bun installed (v1.0+)
- PostgreSQL installed and running
- Node.js (optional, for compatibility)

## Installation

1. Install dependencies:
```bash
bun install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=filemanager
PORT=3000
NODE_ENV=development
```

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
