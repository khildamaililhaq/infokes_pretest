<template>
  <form @submit.prevent="handleSubmit" class="folder-form">
    <h3>{{ folder ? 'Edit Folder' : 'Create New Folder' }}</h3>
    
    <div class="form-group">
      <label for="name">Name *</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        placeholder="Enter folder name"
      />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        placeholder="Enter folder description (optional)"
        rows="3"
      />
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        {{ folder ? 'Update' : 'Create' }}
      </button>
      <button type="button" @click="$emit('cancel')" class="btn">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  folder: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  name: '',
  description: '',
});

watch(() => props.folder, (newFolder) => {
  if (newFolder) {
    formData.value = {
      name: newFolder.name || '',
      description: newFolder.description || '',
    };
  } else {
    formData.value = { name: '', description: '' };
  }
}, { immediate: true });

function handleSubmit() {
  emit('submit', { ...formData.value });
}
</script>

<style scoped>
.folder-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  max-width: 500px;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: white;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.btn-primary:hover {
  background: #45a049;
}

.btn:hover {
  background: #f0f0f0;
}
</style>
