const API_BASE_URL = 'http://localhost:3000';

export const folderService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/folders`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getRoot() {
    const response = await fetch(`${API_BASE_URL}/folders/root`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getTree() {
    const response = await fetch(`${API_BASE_URL}/folders/tree`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getContents(id) {
    const response = await fetch(`${API_BASE_URL}/folders/${id}/contents`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async create(folderData) {
    const response = await fetch(`${API_BASE_URL}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(folderData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async update(id, folderData) {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(folderData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },
};
