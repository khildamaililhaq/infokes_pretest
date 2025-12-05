<template>
  <div class="folder-item" @dblclick="$emit('open', folder.id)">
    <span class="folder-icon">📁</span>
    <span class="folder-name">{{ folder.name }}</span>
    <span v-if="folder.description" class="folder-description">
      {{ folder.description }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  folder: {
    type: Object,
    required: true,
  },
});

defineEmits(['open', 'edit', 'delete']);
</script>

<style scoped>
.folder-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.folder-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
  transform: translateX(2px);
}

.folder-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.folder-name {
  font-weight: 600;
  color: #212529;
  font-size: 15px;
  flex-shrink: 0;
}

.folder-description {
  color: #888;
  font-size: 13px;
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
