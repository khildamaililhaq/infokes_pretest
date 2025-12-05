<template>
  <section v-if="folders.length > 0" class="items-section">
    <h2 class="section-title">Folders</h2>
    <div class="items-grid">
      <div 
        v-for="folder in folders"
        :key="folder.id"
        @contextmenu.prevent.stop="handleContextMenu($event, folder)"
      >
        <FolderItem
          :folder="folder"
          @open="$emit('open', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import FolderItem from './FolderItem.vue';

defineProps({
  folders: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['open', 'edit', 'delete', 'contextmenu']);

function handleContextMenu(event, folder) {
  emit('contextmenu', event, folder);
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
