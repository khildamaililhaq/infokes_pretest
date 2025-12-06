import { describe, it, expect, beforeEach, vi } from 'vitest';
import { folderService } from '../src/services/folderService';

const originalFetch = global.fetch;
global.fetch = vi.fn(() => {});

describe('folderService', () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  it('getAll fetches all folders', async () => {
    const mockFolders = [{ id: '1', name: 'Folder 1' }];
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: true, data: mockFolders }),
    }));

    const result = await folderService.getAll();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/folders');
    expect(result).toEqual(mockFolders);
  });

  it('create sends POST request with folder data', async () => {
    const newFolder = { name: 'New Folder', description: 'Test' };
    const createdFolder = { id: '123', ...newFolder };
    
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: true, data: createdFolder }),
    }));

    const result = await folderService.create(newFolder);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFolder),
    });
    expect(result).toEqual(createdFolder);
  });

  it('update sends PATCH request', async () => {
    const updates = { name: 'Updated' };
    const updated = { id: '123', ...updates };
    
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: true, data: updated }),
    }));

    const result = await folderService.update('123', updates);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/folders/123', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    expect(result).toEqual(updated);
  });

  it('delete sends DELETE request', async () => {
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: true }),
    }));

    await folderService.delete('123');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/folders/123', {
      method: 'DELETE',
    });
  });

  it('throws error when API returns success: false', async () => {
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: false, error: 'Something went wrong' }),
    }));

    await expect(folderService.getAll()).rejects.toThrow('Something went wrong');
  });
});
