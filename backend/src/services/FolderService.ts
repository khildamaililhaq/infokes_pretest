import { FolderRepository } from '../repositories/FolderRepository';
import { FileRepository } from '../repositories/FileRepository';
import { Folder } from '../entities/Folder';

export class FolderService {
  private folderRepository: FolderRepository;
  private fileRepository: FileRepository;

  constructor() {
    this.folderRepository = new FolderRepository();
    this.fileRepository = new FileRepository();
  }

  async getAllFolders(): Promise<Folder[]> {
    return this.folderRepository.findAll();
  }

  async getFolderById(id: string): Promise<Folder> {
    const folder = await this.folderRepository.findById(id);
    if (!folder) {
      throw new Error(`Folder with id ${id} not found`);
    }
    return folder;
  }

  async getRootFolders(): Promise<Folder[]> {
    return this.folderRepository.findByParentId(null);
  }

  async getFoldersByParent(parentId: string): Promise<Folder[]> {
    // Verify parent exists
    const parentExists = await this.folderRepository.exists(parentId);
    if (!parentExists) {
      throw new Error(`Parent folder with id ${parentId} not found`);
    }
    return this.folderRepository.findByParentId(parentId);
  }

  async createFolder(data: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<Folder> {
    // Validate name
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Folder name is required');
    }

    // Validate parent exists if provided
    if (data.parentId) {
      const parentExists = await this.folderRepository.exists(data.parentId);
      if (!parentExists) {
        throw new Error(`Parent folder with id ${data.parentId} not found`);
      }
    }

    return this.folderRepository.create({
      name: data.name.trim(),
      description: data.description?.trim(),
      parentId: data.parentId || undefined,
    });
  }

  async updateFolder(
    id: string,
    data: { name?: string; description?: string; parentId?: string }
  ): Promise<Folder> {
    // Verify folder exists
    const exists = await this.folderRepository.exists(id);
    if (!exists) {
      throw new Error(`Folder with id ${id} not found`);
    }

    // Validate name if provided
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Error('Folder name cannot be empty');
    }

    // Validate parent exists if provided
    if (data.parentId) {
      const parentExists = await this.folderRepository.exists(data.parentId);
      if (!parentExists) {
        throw new Error(`Parent folder with id ${data.parentId} not found`);
      }

      // Prevent circular reference
      if (data.parentId === id) {
        throw new Error('A folder cannot be its own parent');
      }
    }

    const updateData: Partial<Folder> = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.parentId !== undefined) updateData.parentId = data.parentId || undefined;

    const updated = await this.folderRepository.update(id, updateData);
    if (!updated) {
      throw new Error(`Failed to update folder with id ${id}`);
    }
    return updated;
  }

  async deleteFolder(id: string): Promise<void> {
    // Verify folder exists
    const exists = await this.folderRepository.exists(id);
    if (!exists) {
      throw new Error(`Folder with id ${id} not found`);
    }

    // Delete folder (cascade will handle children and files)
    const deleted = await this.folderRepository.delete(id);
    if (!deleted) {
      throw new Error(`Failed to delete folder with id ${id}`);
    }
  }

  async getFolderContents(id: string) {
    const folder = await this.getFolderById(id);
    const subFolders = await this.folderRepository.findByParentId(id);
    const files = await this.fileRepository.findByFolderId(id);

    return {
      folder,
      subFolders,
      files,
    };
  }
}
