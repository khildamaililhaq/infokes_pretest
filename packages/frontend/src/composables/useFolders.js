import { ref } from 'vue';
import { folderService } from '../services/folderService';

export function useFolders() {
  const folders = ref([]);
  const currentFolder = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function loadRootFolders() {
    loading.value = true;
    error.value = null;
    try {
      folders.value = await folderService.getRoot();
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function loadFolderContents(folderId) {
    loading.value = true;
    error.value = null;
    try {
      const data = await folderService.getContents(folderId);
      currentFolder.value = data.folder;
      folders.value = data.subFolders;
      return data;
    } catch (e) {
      error.value = e.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createFolder(folderData) {
    loading.value = true;
    error.value = null;
    try {
      const newFolder = await folderService.create(folderData);
      folders.value.push(newFolder);
      return newFolder;
    } catch (e) {
      error.value = e.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateFolder(id, folderData) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await folderService.update(id, folderData);
      const index = folders.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        folders.value[index] = updated;
      }
      if (currentFolder.value && currentFolder.value.id === id) {
        currentFolder.value = updated;
      }
      return updated;
    } catch (e) {
      error.value = e.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteFolder(id) {
    loading.value = true;
    error.value = null;
    try {
      await folderService.delete(id);
      folders.value = folders.value.filter((f) => f.id !== id);
      return true;
    } catch (e) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    folders,
    currentFolder,
    loading,
    error,
    loadRootFolders,
    loadFolderContents,
    createFolder,
    updateFolder,
    deleteFolder,
  };
}
