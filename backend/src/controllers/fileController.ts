import { Elysia, t } from 'elysia';
import { FileService } from '../services/FileService';

const fileService = new FileService();

export const fileController = new Elysia({ prefix: '/files' })
  // Get all files
  .get(
    '/',
    async () => {
      try {
        const files = await fileService.getAllFiles();
        return { success: true, data: files };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      detail: {
        tags: ['Files'],
        summary: 'Get all files',
        description: 'Retrieve all files',
      },
    }
  )

  // Get file by ID
  .get(
    '/:id',
    async ({ params: { id } }) => {
      try {
        const file = await fileService.getFileById(id);
        return { success: true, data: file };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'File ID' }),
      }),
      detail: {
        tags: ['Files'],
        summary: 'Get file by ID',
        description: 'Retrieve a specific file by its ID',
      },
    }
  )

  // Create file
  .post(
    '/',
    async ({ body }) => {
      try {
        const file = await fileService.createFile(body);
        return { success: true, data: file };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      body: t.Object({
        name: t.String({ description: 'File name' }),
        extension: t.Optional(t.String({ description: 'File extension' })),
        size: t.Optional(t.Number({ description: 'File size in bytes' })),
        content: t.Optional(t.String({ description: 'File content' })),
        mimeType: t.Optional(t.String({ description: 'MIME type' })),
        folderId: t.Optional(t.String({ description: 'Folder ID' })),
      }),
      detail: {
        tags: ['Files'],
        summary: 'Create file',
        description: 'Create a new file',
      },
    }
  )

  // Update file
  .patch(
    '/:id',
    async ({ params: { id }, body }) => {
      try {
        const file = await fileService.updateFile(id, body);
        return { success: true, data: file };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'File ID' }),
      }),
      body: t.Object({
        name: t.Optional(t.String({ description: 'File name' })),
        extension: t.Optional(t.String({ description: 'File extension' })),
        size: t.Optional(t.Number({ description: 'File size in bytes' })),
        content: t.Optional(t.String({ description: 'File content' })),
        mimeType: t.Optional(t.String({ description: 'MIME type' })),
        folderId: t.Optional(t.String({ description: 'Folder ID' })),
      }),
      detail: {
        tags: ['Files'],
        summary: 'Update file',
        description: 'Update an existing file',
      },
    }
  )

  // Delete file
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      try {
        await fileService.deleteFile(id);
        return { success: true, message: 'File deleted successfully' };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'File ID' }),
      }),
      detail: {
        tags: ['Files'],
        summary: 'Delete file',
        description: 'Delete a file',
      },
    }
  )

  // Move file
  .post(
    '/:id/move',
    async ({ params: { id }, body }) => {
      try {
        const file = await fileService.moveFile(id, body.folderId || null);
        return { success: true, data: file };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'File ID' }),
      }),
      body: t.Object({
        folderId: t.Optional(t.String({ description: 'New folder ID (null for root)' })),
      }),
      detail: {
        tags: ['Files'],
        summary: 'Move file',
        description: 'Move file to a different folder',
      },
    }
  );
