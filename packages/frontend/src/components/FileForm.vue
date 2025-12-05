<template>
  <form @submit.prevent="handleSubmit" class="file-form">
    <h3>{{ file ? 'Edit File' : 'Create New File' }}</h3>
    
    <div class="form-group">
      <label for="name">Name *</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        placeholder="Enter file name"
      />
    </div>

    <div class="form-group">
      <label for="extension">Extension</label>
      <input
        id="extension"
        v-model="formData.extension"
        type="text"
        placeholder="txt, pdf, etc."
      />
    </div>

    <div class="form-group">
      <label for="content">Content</label>
      <textarea
        id="content"
        v-model="formData.content"
        placeholder="Enter file content (optional)"
        rows="5"
      />
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        {{ file ? 'Update' : 'Create' }}
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
  file: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  name: '',
  extension: '',
  content: '',
});

watch(() => props.file, (newFile) => {
  if (newFile) {
    formData.value = {
      name: newFile.name || '',
      extension: newFile.extension || '',
      content: newFile.content || '',
    };
  } else {
    formData.value = { name: '', extension: '', content: '' };
  }
}, { immediate: true });

function handleSubmit() {
  const data = { ...formData.value };
  if (data.content) {
    data.size = new Blob([data.content]).size;
  }
  emit('submit', data);
}
</script>

<style scoped>
.file-form {
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
  border-color: #2196F3;
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
  background: #2196F3;
  color: white;
  border-color: #2196F3;
}

.btn-primary:hover {
  background: #0b7dda;
}

.btn:hover {
  background: #f0f0f0;
}
</style>
