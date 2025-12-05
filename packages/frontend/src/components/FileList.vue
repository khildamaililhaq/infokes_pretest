<template>
  <section v-if="files.length > 0" class="items-section">
    <h2 class="section-title">Files</h2>
    <div class="items-grid">
      <div 
        v-for="file in files"
        :key="file.id"
        @contextmenu.prevent.stop="handleContextMenu($event, file)"
      >
        <FileItem
          :file="file"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import FileItem from './FileItem.vue';

defineProps({
  files: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete', 'contextmenu']);

function handleContextMenu(event, file) {
  emit('contextmenu', event, file);
}
</script>

<style scoped>
.items-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding-left: 4px;
}

.items-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
