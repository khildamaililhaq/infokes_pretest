<template>
  <div class="tree-folder">
    <div 
      class="tree-item"
      :class="{ active: currentFolderId === folder.id }"
      :style="{ paddingLeft: (level * 20 + 16) + 'px' }"
      @click="handleClick"
    >
      <span class="tree-toggle" @click.stop="toggleExpanded">
        <span v-if="hasChildren">{{ isExpanded ? '▼' : '▶' }}</span>
        <span v-else class="empty-toggle"></span>
      </span>
      <span class="tree-icon">📁</span>
      <span class="tree-label">{{ folder.name }}</span>
    </div>
    
    <div v-if="isExpanded && hasChildren" class="tree-children">
      <TreeFolder
        v-for="child in children"
        :key="child.id"
        :folder="child"
        :currentFolderId="currentFolderId"
        :level="level + 1"
        @navigate="$emit('navigate', $event)"
        @load-children="$emit('load-children', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  folder: {
    type: Object,
    required: true
  },
  currentFolderId: {
    type: String,
    default: null
  },
  level: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['navigate', 'load-children']);

const isExpanded = ref(false);

const children = computed(() => {
  return props.folder.children || [];
});

const hasChildren = computed(() => {
  return children.value.length > 0;
});

function toggleExpanded(event) {
  event.stopPropagation();
  isExpanded.value = !isExpanded.value;
}

function handleClick() {
  emit('navigate', props.folder.id);
}

// Auto-expand if this folder is in the current path
watch(() => props.currentFolderId, (newId) => {
  if (newId === props.folder.id && !isExpanded.value) {
    isExpanded.value = true;
  }
}, { immediate: true });
</script>

<style scoped>
.tree-folder {
  user-select: none;
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
}

.tree-item:hover {
  background-color: #e9ecef;
}

.tree-item.active {
  background-color: #007bff;
  color: white;
}

.tree-toggle {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #666;
  cursor: pointer;
  flex-shrink: 0;
}

.tree-item.active .tree-toggle {
  color: white;
}

.empty-toggle {
  width: 16px;
  display: inline-block;
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

.tree-children {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
