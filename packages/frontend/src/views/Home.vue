<template>
  <div class="file-manager-layout">
    <!-- Sidebar -->
    <Sidebar 
      :rootFolders="rootFolders"
      :currentFolderId="currentFolderId"
      :fileCount="files.length"
      :folderCount="folders.length"
      @navigate="navigateToFolder"
    />
    
    <!-- Main Content -->
    <main class="main-content">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-bar">
        <Breadcrumb :breadcrumbs="breadcrumbs" @navigate="navigateToFolder" />
      </div>

      <!-- Content Area -->
      <div class="content-wrapper" @contextmenu.prevent="handleContextMenu">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <template v-if="!loading">
          <div class="content-area">
            <FolderList 
              :folders="folders"
              @open="openFolder"
              @edit="editFolder"
              @delete="confirmDeleteFolder"
              @contextmenu="handleFolderContextMenu"
            />

            <FileList 
              :files="files"
              @edit="editFile"
              @delete="confirmDeleteFile"
              @contextmenu="handleFileContextMenu"
            />

            <EmptyState 
              v-if="folders.length === 0 && files.length === 0"
            />
          </div>
        </template>
      </div>
    </main>
    
    <!-- Modals -->
    <div v-if="showFolderForm" class="modal-overlay">
      <FolderForm
        :folder="editingFolder"
        @submit="handleFolderSubmit"
        @cancel="cancelFolderForm"
      />
    </div>

    <div v-if="showFileForm" class="modal-overlay">
      <FileForm
        :file="editingFile"
        @submit="handleFileSubmit"
        @cancel="cancelFileForm"
      />
    </div>
    
    <!-- Context Menu -->
    <ContextMenu 
      :visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :items="contextMenu.items"
      @close="closeContextMenu"
      @select="handleContextMenuAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useFolders } from '../composables/useFolders';
import { useFiles } from '../composables/useFiles';
import { useContextMenu } from '../composables/useContextMenu';
import { folderService } from '../services/folderService.js';
import Sidebar from '../components/Sidebar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import FolderList from '../components/FolderList.vue';
import FileList from '../components/FileList.vue';
import EmptyState from '../components/EmptyState.vue';
import FolderForm from '../components/FolderForm.vue';
import FileForm from '../components/FileForm.vue';
import ContextMenu from '../components/ContextMenu.vue';

const {
  folders,
  currentFolder,
  loading: foldersLoading,
  error: foldersError,
  loadRootFolders,
  loadFolderContents,
  createFolder,
  updateFolder,
  deleteFolder,
} = useFolders();

const {
  files,
  loading: filesLoading,
  error: filesError,
  createFile,
  updateFile,
  deleteFile,
} = useFiles();

const loading = computed(() => foldersLoading.value || filesLoading.value);
const error = computed(() => foldersError.value || filesError.value);

const {
  contextMenu,
  showContextMenu,
  closeContextMenu,
  createFolderContextMenu,
  createFolderItemContextMenu,
  createFileItemContextMenu
} = useContextMenu();

const showFolderForm = ref(false);
const showFileForm = ref(false);
const editingFolder = ref(null);
const editingFile = ref(null);
const breadcrumbs = ref([]);
const currentFolderId = ref(null);
const rootFolders = ref([]);

async function loadFolderTree() {
  try {
    const tree = await folderService.getTree();
    rootFolders.value = tree;
  } catch (err) {
    console.error('Failed to load folder tree:', err);
  }
}

onMounted(async () => {
  await loadFolderTree();
});

async function navigateToFolder(folderId) {
  closeContextMenu();
  if (folderId === null) {
    currentFolderId.value = null;
    breadcrumbs.value = [];
    folders.value = [];
    files.value = [];
  } else {
    const data = await loadFolderContents(folderId);
    if (data) {
      currentFolderId.value = folderId;
      files.value = data.files;
      updateBreadcrumbs(data.folder);
    }
  }
}

function updateBreadcrumbs(folder) {
  breadcrumbs.value = [];
  let current = folder;
  while (current) {
    breadcrumbs.value.unshift({ id: current.id, name: current.name });
    current = current.parent;
  }
}

async function openFolder(folderId) {
  await navigateToFolder(folderId);
}

function editFolder(folder) {
  editingFolder.value = folder;
  showFolderForm.value = true;
}

function editFile(file) {
  editingFile.value = file;
  showFileForm.value = true;
}

async function handleFolderSubmit(folderData) {
  const dataWithParent = {
    ...folderData,
    ...(currentFolderId.value && { parentId: currentFolderId.value }),
  };

  if (editingFolder.value) {
    await updateFolder(editingFolder.value.id, dataWithParent);
  } else {
    await createFolder(dataWithParent);
  }
  
  cancelFolderForm();
  
  // Reload the tree and current view
  await loadFolderTree();
  if (currentFolderId.value) {
    await navigateToFolder(currentFolderId.value);
  }
}

async function handleFileSubmit(fileData) {
  const dataWithFolder = {
    ...fileData,
    ...(currentFolderId.value && { folderId: currentFolderId.value }),
  };

  if (editingFile.value) {
    await updateFile(editingFile.value.id, dataWithFolder);
  } else {
    await createFile(dataWithFolder);
  }
  
  cancelFileForm();
  
  // Reload the current view
  if (currentFolderId.value) {
    await navigateToFolder(currentFolderId.value);
  }
}

function cancelFolderForm() {
  showFolderForm.value = false;
  editingFolder.value = null;
}

function cancelFileForm() {
  showFileForm.value = false;
  editingFile.value = null;
}

async function confirmDeleteFolder(folderId) {
  if (confirm('Are you sure you want to delete this folder? This will also delete all subfolders and files inside it.')) {
    await deleteFolder(folderId);
  }
}

async function confirmDeleteFile(fileId) {
  if (confirm('Are you sure you want to delete this file?')) {
    await deleteFile(fileId);
  }
}

// Context Menu Handlers
function handleContextMenu(event) {
  const items = createFolderContextMenu(currentFolderId.value);
  showContextMenu(event, items);
}

function handleFolderContextMenu(event, folder) {
  const items = createFolderItemContextMenu();
  showContextMenu(event, items, folder);
}

function handleFileContextMenu(event, file) {
  const items = createFileItemContextMenu();
  showContextMenu(event, items, file);
}

async function handleContextMenuAction(action) {
  const target = contextMenu.value.target;
  
  switch (action) {
    case 'new-folder':
      // Right-click on empty area - create in current folder
      // currentFolderId.value already set correctly
      showFolderForm.value = true;
      break;
    case 'new-file':
      // Right-click on empty area - create in current folder
      // currentFolderId.value already set correctly
      showFileForm.value = true;
      break;
    case 'new-folder-inside':
      if (target) {
        // Temporarily change context to create inside target folder
        const originalFolderId = currentFolderId.value;
        currentFolderId.value = target.id;
        showFolderForm.value = true;
        // Note: currentFolderId will be restored after form is submitted/cancelled
      }
      break;
    case 'new-file-inside':
      if (target) {
        // Temporarily change context to create inside target folder
        const originalFolderId = currentFolderId.value;
        currentFolderId.value = target.id;
        showFileForm.value = true;
        // Note: currentFolderId will be restored after form is submitted/cancelled
      }
      break;
    case 'open-folder':
      if (target) await openFolder(target.id);
      break;
    case 'rename-folder':
      if (target) editFolder(target);
      break;
    case 'rename-file':
      if (target) editFile(target);
      break;
    case 'delete-folder':
      if (target) await confirmDeleteFolder(target.id);
      break;
    case 'delete-file':
      if (target) await confirmDeleteFile(target.id);
      break;
  }
}
</script>

<style scoped>
/* Layout */
.file-manager-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
}

/* Breadcrumb Bar */
.breadcrumb-bar {
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

/* Content Wrapper */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  position: relative;
  background: #ffffff;
  cursor: default;
}

/* Content Area */
.content-area {
  min-height: calc(100vh - 120px);
}

/* Loading & Error States */
.loading {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 15px;
}

.error {
  background: #fef2f2;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #fecaca;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}
</style>
