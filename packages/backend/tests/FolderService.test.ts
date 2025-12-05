import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { AppDataSource, initializeDatabase } from '../src/config/database';
import { FolderService } from '../src/services/FolderService';
import { FolderRepository } from '../src/repositories/FolderRepository';

describe('FolderService', () => {
  let folderService: FolderService;
  let folderRepository: FolderRepository;

  beforeAll(async () => {
    // Initialize test database
    await initializeDatabase();
    folderService = new FolderService();
    folderRepository = new FolderRepository();
  });

  afterAll(async () => {
    // Clean up and close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    // Clean up database before each test using CASCADE
    await AppDataSource.query('TRUNCATE TABLE files CASCADE');
    await AppDataSource.query('TRUNCATE TABLE folders CASCADE');
  });

  describe('createFolder', () => {
    it('should create a folder successfully', async () => {
      const folderData = {
        name: 'Test Folder',
        description: 'Test description',
      };

      const folder = await folderService.createFolder(folderData);

      expect(folder).toBeDefined();
      expect(folder.name).toBe('Test Folder');
      expect(folder.description).toBe('Test description');
      expect(folder.id).toBeDefined();
    });

    it('should throw error when name is empty', async () => {
      const folderData = {
        name: '',
      };

      expect(async () => {
        await folderService.createFolder(folderData);
      }).toThrow('Folder name is required');
    });

    it('should create a folder with parent', async () => {
      const parent = await folderService.createFolder({ name: 'Parent' });
      const child = await folderService.createFolder({
        name: 'Child',
        parentId: parent.id,
      });

      expect(child.parentId).toBe(parent.id);
    });

    it('should throw error when parent does not exist', async () => {
      expect(async () => {
        await folderService.createFolder({
          name: 'Test',
          parentId: 'non-existent-id',
        });
      }).toThrow();
    });
  });

  describe('updateFolder', () => {
    it('should update folder name', async () => {
      const folder = await folderService.createFolder({ name: 'Original' });
      const updated = await folderService.updateFolder(folder.id, {
        name: 'Updated',
      });

      expect(updated.name).toBe('Updated');
    });

    it('should throw error when folder does not exist', async () => {
      expect(async () => {
        await folderService.updateFolder('non-existent-id', { name: 'Test' });
      }).toThrow();
    });

    it('should prevent circular reference', async () => {
      const folder = await folderService.createFolder({ name: 'Test' });

      expect(async () => {
        await folderService.updateFolder(folder.id, { parentId: folder.id });
      }).toThrow('A folder cannot be its own parent');
    });
  });

  describe('deleteFolder', () => {
    it('should delete folder successfully', async () => {
      const folder = await folderService.createFolder({ name: 'To Delete' });
      await folderService.deleteFolder(folder.id);

      expect(async () => {
        await folderService.getFolderById(folder.id);
      }).toThrow();
    });

    it('should throw error when folder does not exist', async () => {
      expect(async () => {
        await folderService.deleteFolder('non-existent-id');
      }).toThrow();
    });
  });

  describe('getFolderById', () => {
    it('should retrieve folder by id', async () => {
      const folder = await folderService.createFolder({ name: 'Test' });
      const retrieved = await folderService.getFolderById(folder.id);

      expect(retrieved.id).toBe(folder.id);
      expect(retrieved.name).toBe('Test');
    });

    it('should throw error when folder does not exist', async () => {
      expect(async () => {
        await folderService.getFolderById('non-existent-id');
      }).toThrow();
    });
  });

  describe('getRootFolders', () => {
    it('should return only root folders', async () => {
      const root1 = await folderService.createFolder({ name: 'Root 1' });
      const root2 = await folderService.createFolder({ name: 'Root 2' });
      await folderService.createFolder({
        name: 'Child',
        parentId: root1.id,
      });

      const roots = await folderService.getRootFolders();

      expect(roots.length).toBe(2);
      expect(roots.map((f) => f.id).sort()).toEqual([root1.id, root2.id].sort());
    });
  });

  describe('getFolderContents', () => {
    it('should return folder with subfolders and files', async () => {
      const parent = await folderService.createFolder({ name: 'Parent' });
      await folderService.createFolder({
        name: 'Child',
        parentId: parent.id,
      });

      const contents = await folderService.getFolderContents(parent.id);

      expect(contents.folder.id).toBe(parent.id);
      expect(contents.subFolders.length).toBe(1);
      expect(contents.files).toBeDefined();
    });
  });
});
