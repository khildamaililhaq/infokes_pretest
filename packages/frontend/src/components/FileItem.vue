<template>
  <div class="file-item">
    <span class="file-icon">📄</span>
    <span class="file-name">{{ file.name }}<span v-if="file.extension" class="file-extension">.{{ file.extension }}</span></span>
    <span class="file-size">{{ formatSize(file.size) }}</span>
  </div>
</template>

<script setup>
defineProps({
  file: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete']);

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
</script>

<style scoped>
.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 6px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.file-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
  transform: translateX(2px);
}

.file-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.file-name {
  font-weight: 500;
  color: #212529;
  font-size: 14px;
  flex: 1;
}

.file-extension {
  color: #888;
}

.file-size {
  color: #999;
  font-size: 12px;
  flex-shrink: 0;
}
</style>
