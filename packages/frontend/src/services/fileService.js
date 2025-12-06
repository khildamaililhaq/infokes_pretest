const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const fileService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/files`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/files/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async create(fileData) {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async update(id, fileData) {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  async move(id, folderId) {
    const response = await fetch(`${API_BASE_URL}/files/${id}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },
};
