import { Repository, IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Folder } from '../entities/Folder';

export class FolderRepository {
  private repository: Repository<Folder>;

  constructor() {
    this.repository = AppDataSource.getRepository(Folder);
  }

  async findAll(): Promise<Folder[]> {
    return this.repository.find({
      relations: ['children', 'files', 'parent'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Folder | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['children', 'files', 'parent'],
    });
  }

  async findByParentId(parentId: string | null): Promise<Folder[]> {
    if (parentId === null) {
      // Explicitly query for folders with null parentId (root folders)
      return this.repository.find({
        where: { parentId: IsNull() },
        relations: ['children', 'files'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.repository.find({
      where: { parentId },
      relations: ['children', 'files'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Folder>): Promise<Folder> {
    const folder = this.repository.create(data);
    return this.repository.save(folder);
  }

  async update(id: string, data: Partial<Folder>): Promise<Folder | null> {
    await this.repository.update(id, data);
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

  async countChildren(parentId: string): Promise<number> {
    return this.repository.count({ where: { parentId } });
  }
}
