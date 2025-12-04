import { FileRepository } from '../repositories/FileRepository';
import { FolderRepository } from '../repositories/FolderRepository';
import { File } from '../entities/File';

export class FileService {
  private fileRepository: FileRepository;
  private folderRepository: FolderRepository;

  constructor() {
    this.fileRepository = new FileRepository();
    this.folderRepository = new FolderRepository();
  }

  async getAllFiles(): Promise<File[]> {
    return this.fileRepository.findAll();
  }

  async getFileById(id: string): Promise<File> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new Error(`File with id ${id} not found`);
    }
    return file;
  }

  async getFilesByFolder(folderId: string | null): Promise<File[]> {
    if (folderId) {
      const folderExists = await this.folderRepository.exists(folderId);
      if (!folderExists) {
        throw new Error(`Folder with id ${folderId} not found`);
      }
    }
    return this.fileRepository.findByFolderId(folderId);
  }

  async createFile(data: {
    name: string;
    extension?: string;
    size?: number;
    content?: string;
    mimeType?: string;
    folderId?: string;
  }): Promise<File> {
    // Validate name
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('File name is required');
    }

    // Validate folder exists if provided
    if (data.folderId) {
      const folderExists = await this.folderRepository.exists(data.folderId);
      if (!folderExists) {
        throw new Error(`Folder with id ${data.folderId} not found`);
      }
    }

    return this.fileRepository.create({
      name: data.name.trim(),
      extension: data.extension?.trim(),
      size: data.size || 0,
      content: data.content,
      mimeType: data.mimeType?.trim(),
      folderId: data.folderId || undefined,
    });
  }

  async updateFile(
    id: string,
    data: {
      name?: string;
      extension?: string;
      size?: number;
      content?: string;
      mimeType?: string;
      folderId?: string;
    }
  ): Promise<File> {
    // Verify file exists
    const exists = await this.fileRepository.exists(id);
    if (!exists) {
      throw new Error(`File with id ${id} not found`);
    }

    // Validate name if provided
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }

    // Validate folder exists if provided
    if (data.folderId) {
      const folderExists = await this.folderRepository.exists(data.folderId);
      if (!folderExists) {
        throw new Error(`Folder with id ${data.folderId} not found`);
      }
    }

    const updateData: Partial<File> = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.extension !== undefined) updateData.extension = data.extension.trim();
    if (data.size !== undefined) updateData.size = data.size;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.mimeType !== undefined) updateData.mimeType = data.mimeType.trim();
    if (data.folderId !== undefined) updateData.folderId = data.folderId || undefined;

    const updated = await this.fileRepository.update(id, updateData);
    if (!updated) {
      throw new Error(`Failed to update file with id ${id}`);
    }
    return updated;
  }

  async deleteFile(id: string): Promise<void> {
    // Verify file exists
    const exists = await this.fileRepository.exists(id);
    if (!exists) {
      throw new Error(`File with id ${id} not found`);
    }

    const deleted = await this.fileRepository.delete(id);
    if (!deleted) {
      throw new Error(`Failed to delete file with id ${id}`);
    }
  }

  async moveFile(id: string, newFolderId: string | null): Promise<File> {
    // Verify file exists
    const exists = await this.fileRepository.exists(id);
    if (!exists) {
      throw new Error(`File with id ${id} not found`);
    }

    // Validate folder exists if provided
    if (newFolderId) {
      const folderExists = await this.folderRepository.exists(newFolderId);
      if (!folderExists) {
        throw new Error(`Folder with id ${newFolderId} not found`);
      }
    }

    const updated = await this.fileRepository.update(id, { folderId: newFolderId || undefined });
    if (!updated) {
      throw new Error(`Failed to move file with id ${id}`);
    }
    return updated;
  }
}
