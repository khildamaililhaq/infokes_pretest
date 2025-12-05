<template>
  <div class="empty-state">
    <div class="empty-icon">📂</div>
    <p>{{ message }}</p>
    <p class="empty-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'No folders or files yet'
  },
  hint: {
    type: String,
    default: 'Right-click to create one'
  }
});
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  margin: 8px 0;
  color: #6b7280;
}

.empty-hint {
  font-size: 14px;
  color: #9ca3af;
}
</style>
