import { Elysia, t } from 'elysia';
import { FolderService } from '../services/FolderService';

const folderService = new FolderService();

export const folderController = new Elysia({ prefix: '/folders' })
  // Get folder tree
  .get(
    '/tree',
    async () => {
      try {
        const tree = await folderService.getFolderTree();
        return { success: true, data: tree };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      detail: {
        tags: ['Folders'],
        summary: 'Get folder tree',
        description: 'Retrieve all folders in a hierarchical tree structure',
      },
    }
  )

  // Get all folders
  .get(
    '/',
    async () => {
      try {
        const folders = await folderService.getAllFolders();
        return { success: true, data: folders };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      detail: {
        tags: ['Folders'],
        summary: 'Get all folders',
        description: 'Retrieve all folders with their relationships',
      },
    }
  )

  // Get root folders
  .get(
    '/root',
    async () => {
      try {
        const folders = await folderService.getRootFolders();
        return { success: true, data: folders };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      detail: {
        tags: ['Folders'],
        summary: 'Get root folders',
        description: 'Retrieve all folders without a parent (parentId is null)',
      },
    }
  )

  // Get folder by ID
  .get(
    '/:id',
    async ({ params: { id } }) => {
      try {
        const folder = await folderService.getFolderById(id);
        return { success: true, data: folder };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'Folder ID' }),
      }),
      detail: {
        tags: ['Folders'],
        summary: 'Get folder by ID',
        description: 'Retrieve a specific folder by its ID',
      },
    }
  )

  // Get folder contents
  .get(
    '/:id/contents',
    async ({ params: { id } }) => {
      try {
        const contents = await folderService.getFolderContents(id);
        return { success: true, data: contents };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'Folder ID' }),
      }),
      detail: {
        tags: ['Folders'],
        summary: 'Get folder contents',
        description: 'Retrieve folder with its subfolders and files',
      },
    }
  )

  // Create folder
  .post(
    '/',
    async ({ body }) => {
      try {
        const folder = await folderService.createFolder(body);
        return { success: true, data: folder };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      body: t.Object({
        name: t.String({ description: 'Folder name' }),
        description: t.Optional(t.String({ description: 'Folder description' })),
        parentId: t.Optional(t.String({ description: 'Parent folder ID (omit for root folder)' })),
      }),
      detail: {
        tags: ['Folders'],
        summary: 'Create folder',
        description: 'Create a new folder. If parentId is not provided, folder will be created in root.',
      },
    }
  )

  // Update folder
  .patch(
    '/:id',
    async ({ params: { id }, body }) => {
      try {
        const folder = await folderService.updateFolder(id, body);
        return { success: true, data: folder };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'Folder ID' }),
      }),
      body: t.Object({
        name: t.Optional(t.String({ description: 'Folder name' })),
        description: t.Optional(t.String({ description: 'Folder description' })),
        parentId: t.Optional(t.String({ description: 'Parent folder ID' })),
      }),
      detail: {
        tags: ['Folders'],
        summary: 'Update folder',
        description: 'Update an existing folder',
      },
    }
  )

  // Delete folder
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      try {
        await folderService.deleteFolder(id);
        return { success: true, message: 'Folder deleted successfully' };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'Folder ID' }),
      }),
      detail: {
        tags: ['Folders'],
        summary: 'Delete folder',
        description: 'Delete a folder and all its contents',
      },
    }
  );
