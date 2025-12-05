import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { fileService } from '../src/services/fileService';

const originalFetch = global.fetch;
global.fetch = mock(() => {});

describe('fileService', () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  it('getAll fetches all files', async () => {
    const mockFiles = [{ id: '1', name: 'test.txt' }];
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: true, data: mockFiles }),
    }));

    const result = await fileService.getAll();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/files');
    expect(result).toEqual(mockFiles);
  });

  it('create sends POST request with file data', async () => {
    const newFile = { name: 'test', extension: 'txt', content: 'Hello', folderId: '123' };
    const createdFile = { id: '456', ...newFile, size: 5 };
    
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: true, data: createdFile }),
    }));

    const result = await fileService.create(newFile);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFile),
    });
    expect(result).toEqual(createdFile);
  });

  it('update sends PATCH request', async () => {
    const updates = { content: 'Updated content' };
    const updated = { id: '456', ...updates };
    
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: true, data: updated }),
    }));

    const result = await fileService.update('456', updates);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/files/456', {
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

    await fileService.delete('456');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/files/456', {
      method: 'DELETE',
    });
  });

  it('move sends POST request to move endpoint', async () => {
    const movedFile = { id: '456', folderId: '789' };
    
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: true, data: movedFile }),
    }));

    const result = await fileService.move('456', '789');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/files/456/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId: '789' }),
    });
    expect(result).toEqual(movedFile);
  });

  it('throws error when API returns success: false', async () => {
    global.fetch.mockImplementation(() => Promise.resolve({
      json: async () => ({ success: false, error: 'File not found' }),
    }));

    await expect(fileService.getAll()).rejects.toThrow('File not found');
  });
});
