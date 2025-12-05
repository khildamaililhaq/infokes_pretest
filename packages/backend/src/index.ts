import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { initializeDatabase } from './config/database';
import { folderController } from './controllers/folderController';
import { fileController } from './controllers/fileController';
import 'reflect-metadata';

// Initialize database
await initializeDatabase();

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'File Manager API',
          version: '1.0.0',
          description: 'A simple file manager API with folders and files',
        },
        tags: [
          { name: 'Folders', description: 'Folder management endpoints' },
          { name: 'Files', description: 'File management endpoints' },
        ],
      },
      path: '/docs',
    })
  )
  .get('/', () => ({
    message: 'File Manager API',
    version: '1.0.0',
    docs: '/docs',
  }))
  .use(folderController)
  .use(fileController)
  .onError(({ error, code }) => {
    console.error(`Error [${code}]:`, error);
    return {
      success: false,
      error: (error as Error).message || 'Internal server error',
      code,
    };
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
🚀 File Manager API is running!
📝 Swagger documentation: http://localhost:${PORT}/docs
🔗 API endpoint: http://localhost:${PORT}
  `);
});
