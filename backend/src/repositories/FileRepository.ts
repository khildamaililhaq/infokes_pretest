import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { File } from '../entities/File';

export class FileRepository {
  private repository: Repository<File>;

  constructor() {
    this.repository = AppDataSource.getRepository(File);
  }

  async findAll(): Promise<File[]> {
    return this.repository.find({
      relations: ['folder'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<File | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['folder'],
    });
  }

  async findByFolderId(folderId: string | null): Promise<File[]> {
    return this.repository.find({
      where: { folderId: folderId || undefined },
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<File>): Promise<File> {
    const file = this.repository.create(data);
    return this.repository.save(file);
  }

  async update(id: string, data: Partial<File>): Promise<File | null> {
    // Handle null explicitly for nullable fields
    const updateData: any = { ...data };
    if ('folderId' in data && data.folderId === undefined) {
      updateData.folderId = null;
    }
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async countByFolder(folderId: string): Promise<number> {
    return this.repository.count({ where: { folderId } });
  }
}
