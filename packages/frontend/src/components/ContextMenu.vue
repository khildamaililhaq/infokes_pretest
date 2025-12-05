<template>
  <teleport to="body">
    <div 
      v-if="visible" 
      class="context-menu"
      :style="{ top: y + 'px', left: x + 'px' }"
      @click.stop
      @contextmenu.prevent.stop
    >
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="context-menu-item"
        :class="{ divider: item.divider, danger: item.danger }"
        @click="handleClick(item)"
      >
        <template v-if="!item.divider">
          <span class="menu-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </template>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  items: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'select']);

function handleClick(item) {
  if (item.action) {
    emit('select', item.action);
  }
  emit('close');
}

function handleClickOutside(e) {
  if (props.visible) {
    // Small delay to allow the context menu to show first
    setTimeout(() => {
      emit('close');
    }, 10);
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  min-width: 200px;
  z-index: 10000;
}

.context-menu-item {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #333;
  transition: background-color 0.15s;
}

.context-menu-item:hover {
  background-color: #f5f5f5;
}

.context-menu-item.danger {
  color: #d32f2f;
}

.context-menu-item.danger:hover {
  background-color: #ffebee;
}

.context-menu-item.divider {
  height: 1px;
  padding: 0;
  margin: 4px 0;
  background-color: #e0e0e0;
  cursor: default;
}

.context-menu-item.divider:hover {
  background-color: #e0e0e0;
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}
</style>
