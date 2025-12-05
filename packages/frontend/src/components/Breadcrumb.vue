<template>
  <div class="breadcrumb">
    <button @click="$emit('navigate', null)" class="breadcrumb-item">
      🏠 Root
    </button>
    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
      <span class="breadcrumb-separator">/</span>
      <button @click="$emit('navigate', crumb.id)" class="breadcrumb-item">
        {{ crumb.name }}
      </button>
    </template>
  </div>
</template>

<script setup>
defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['navigate']);
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.breadcrumb-item {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.15s;
  font-weight: 500;
}

.breadcrumb-item:hover {
  background: #f0f0f0;
  color: #2196F3;
}

.breadcrumb-separator {
  color: #ccc;
  user-select: none;
}
</style>
