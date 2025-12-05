import { ref } from 'vue';

export function useContextMenu() {
  const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    items: [],
    target: null
  });

  function showContextMenu(event, items, target = null) {
    contextMenu.value = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      items,
      target
    };
  }

  function closeContextMenu() {
    contextMenu.value.visible = false;
  }

  function createFolderContextMenu(currentFolderId) {
    const label = currentFolderId ? 'New Folder Here' : 'New Folder';
    const fileLabel = currentFolderId ? 'New File Here' : 'New File';
    
    return [
      { icon: '📁', label, action: 'new-folder' },
      { icon: '📄', label: fileLabel, action: 'new-file' },
    ];
  }

  function createFolderItemContextMenu() {
    return [
      { icon: '📂', label: 'Open', action: 'open-folder' },
      { icon: '📁', label: 'New Folder Inside', action: 'new-folder-inside' },
      { icon: '📄', label: 'New File Inside', action: 'new-file-inside' },
      { divider: true },
      { icon: '✏️', label: 'Rename', action: 'rename-folder' },
      { divider: true },
      { icon: '🗑️', label: 'Delete', action: 'delete-folder', danger: true },
    ];
  }

  function createFileItemContextMenu() {
    return [
      { icon: '✏️', label: 'Rename', action: 'rename-file' },
      { divider: true },
      { icon: '🗑️', label: 'Delete', action: 'delete-file', danger: true },
    ];
  }

  return {
    contextMenu,
    showContextMenu,
    closeContextMenu,
    createFolderContextMenu,
    createFolderItemContextMenu,
    createFileItemContextMenu
  };
}
