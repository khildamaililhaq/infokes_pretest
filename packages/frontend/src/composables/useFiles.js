import { ref } from 'vue';
import { fileService } from '../services/fileService';

export function useFiles() {
  const files = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function loadFiles(folderId = null) {
    loading.value = true;
    error.value = null;
    try {
      files.value = await fileService.getAll();
      if (folderId) {
        files.value = files.value.filter((f) => f.folderId === folderId);
      }
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function createFile(fileData) {
    loading.value = true;
    error.value = null;
    try {
      const newFile = await fileService.create(fileData);
      files.value.push(newFile);
      return newFile;
    } catch (e) {
      error.value = e.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateFile(id, fileData) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await fileService.update(id, fileData);
      const index = files.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        files.value[index] = updated;
      }
      return updated;
    } catch (e) {
      error.value = e.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteFile(id) {
    loading.value = true;
    error.value = null;
    try {
      await fileService.delete(id);
      files.value = files.value.filter((f) => f.id !== id);
      return true;
    } catch (e) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function moveFile(id, folderId) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await fileService.move(id, folderId);
      const index = files.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        files.value[index] = updated;
      }
      return updated;
    } catch (e) {
      error.value = e.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    files,
    loading,
    error,
    loadFiles,
    createFile,
    updateFile,
    deleteFile,
    moveFile,
  };
}
