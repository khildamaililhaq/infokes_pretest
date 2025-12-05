import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { AppDataSource, initializeDatabase } from '../src/config/database';
import { FileService } from '../src/services/FileService';
import { FolderService } from '../src/services/FolderService';
import { FileRepository } from '../src/repositories/FileRepository';
import { FolderRepository } from '../src/repositories/FolderRepository';

describe('FileService', () => {
  let fileService: FileService;
  let folderService: FolderService;
  let fileRepository: FileRepository;
  let folderRepository: FolderRepository;

  beforeAll(async () => {
    // Initialize test database
    await initializeDatabase();
    fileService = new FileService();
    folderService = new FolderService();
    fileRepository = new FileRepository();
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

  describe('createFile', () => {
    it('should create a file successfully', async () => {
      const fileData = {
        name: 'test.txt',
        extension: 'txt',
        size: 100,
        content: 'Hello World',
        mimeType: 'text/plain',
      };

      const file = await fileService.createFile(fileData);

      expect(file).toBeDefined();
      expect(file.name).toBe('test.txt');
      expect(file.extension).toBe('txt');
      expect(file.size).toBe(100);
      expect(file.content).toBe('Hello World');
      expect(file.mimeType).toBe('text/plain');
      expect(file.id).toBeDefined();
    });

    it('should throw error when name is empty', async () => {
      const fileData = {
        name: '',
      };

      expect(async () => {
        await fileService.createFile(fileData);
      }).toThrow('File name is required');
    });

    it('should create a file in a folder', async () => {
      const folder = await folderService.createFolder({ name: 'Test Folder' });
      const file = await fileService.createFile({
        name: 'test.txt',
        folderId: folder.id,
      });

      expect(file.folderId).toBe(folder.id);
    });

    it('should throw error when folder does not exist', async () => {
      expect(async () => {
        await fileService.createFile({
          name: 'test.txt',
          folderId: 'non-existent-id',
        });
      }).toThrow();
    });
  });

  describe('updateFile', () => {
    it('should update file properties', async () => {
      const file = await fileService.createFile({ name: 'original.txt' });
      const updated = await fileService.updateFile(file.id, {
        name: 'updated.txt',
        extension: 'txt',
        size: 200,
      });

      expect(updated.name).toBe('updated.txt');
      expect(updated.extension).toBe('txt');
      expect(updated.size).toBe(200);
    });

    it('should throw error when file does not exist', async () => {
      expect(async () => {
        await fileService.updateFile('non-existent-id', { name: 'test.txt' });
      }).toThrow();
    });

    it('should throw error when name is empty', async () => {
      const file = await fileService.createFile({ name: 'test.txt' });

      expect(async () => {
        await fileService.updateFile(file.id, { name: '' });
      }).toThrow('File name cannot be empty');
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const file = await fileService.createFile({ name: 'to-delete.txt' });
      await fileService.deleteFile(file.id);

      expect(async () => {
        await fileService.getFileById(file.id);
      }).toThrow();
    });

    it('should throw error when file does not exist', async () => {
      expect(async () => {
        await fileService.deleteFile('non-existent-id');
      }).toThrow();
    });
  });

  describe('getFileById', () => {
    it('should retrieve file by id', async () => {
      const file = await fileService.createFile({ name: 'test.txt' });
      const retrieved = await fileService.getFileById(file.id);

      expect(retrieved.id).toBe(file.id);
      expect(retrieved.name).toBe('test.txt');
    });

    it('should throw error when file does not exist', async () => {
      expect(async () => {
        await fileService.getFileById('non-existent-id');
      }).toThrow();
    });
  });

  describe('moveFile', () => {
    it('should move file to a different folder', async () => {
      const folder1 = await folderService.createFolder({ name: 'Folder 1' });
      const folder2 = await folderService.createFolder({ name: 'Folder 2' });
      const file = await fileService.createFile({
        name: 'test.txt',
        folderId: folder1.id,
      });

      const moved = await fileService.moveFile(file.id, folder2.id);

      expect(moved.folderId).toBe(folder2.id);
    });

    it('should move file to root', async () => {
      const folder = await folderService.createFolder({ name: 'Folder' });
      const file = await fileService.createFile({
        name: 'test.txt',
        folderId: folder.id,
      });

      const moved = await fileService.moveFile(file.id, null);

      expect(moved.folderId).toBeNull();
    });
  });

  describe('getFilesByFolder', () => {
    it('should return files in a folder', async () => {
      const folder = await folderService.createFolder({ name: 'Folder' });
      await fileService.createFile({ name: 'file1.txt', folderId: folder.id });
      await fileService.createFile({ name: 'file2.txt', folderId: folder.id });
      await fileService.createFile({ name: 'file3.txt' }); // root file

      const files = await fileService.getFilesByFolder(folder.id);

      expect(files.length).toBe(2);
    });

    it('should throw error when folder does not exist', async () => {
      expect(async () => {
        await fileService.getFilesByFolder('non-existent-id');
      }).toThrow();
    });
  });
});
