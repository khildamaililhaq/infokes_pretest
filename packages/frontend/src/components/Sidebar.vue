<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>📁 File Manager</h2>
    </div>
    
    <nav class="sidebar-nav">
      <div 
        class="tree-item root"
        :class="{ active: currentFolderId === null }"
        @click="$emit('navigate', null)"
      >
        <span class="tree-icon">🏠</span>
        <span class="tree-label">Home</span>
      </div>
      
      <div class="tree-container">
        <TreeFolder
          v-for="folder in rootFolders"
          :key="folder.id"
          :folder="folder"
          :currentFolderId="currentFolderId"
          :level="0"
          @navigate="$emit('navigate', $event)"
          @load-children="loadFolderChildren"
        />
      </div>
    </nav>
    
    <div class="sidebar-footer">
      <div class="storage-info">
        <div class="storage-label">Storage</div>
        <div class="storage-stats">
          <div>{{ fileCount }} files</div>
          <div>{{ folderCount }} folders</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import TreeFolder from './TreeFolder.vue';

defineProps({
  rootFolders: {
    type: Array,
    default: () => []
  },
  currentFolderId: {
    type: String,
    default: null
  },
  fileCount: {
    type: Number,
    default: 0
  },
  folderCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['navigate']);

async function loadFolderChildren(folderId) {
  // This will be handled by parent component
  return [];
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-width: 250px;
  flex-shrink: 0;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.tree-container {
  padding: 0.5rem 0;
}

.tree-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  font-size: 0.9rem;
  transition: background-color 0.15s;
  user-select: none;
}

.tree-item:hover {
  background-color: #e9ecef;
}

.tree-item.active {
  background-color: #007bff;
  color: white;
}

.tree-item.root {
  font-weight: 500;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.tree-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.tree-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #fff;
}

.storage-info {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.storage-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 0.5rem;
}

.storage-stats {
  font-size: 0.875rem;
  color: #555;
}

.storage-stats div {
  margin: 0.25rem 0;
}
</style>
