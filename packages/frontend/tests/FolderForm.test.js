import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FolderForm from '../src/components/FolderForm.vue';

describe('FolderForm', () => {
  it('renders create mode by default', () => {
    const wrapper = mount(FolderForm);

    expect(wrapper.text()).toContain('Create New Folder');
    expect(wrapper.find('button[type="submit"]').text()).toBe('Create');
  });

  it('renders edit mode when folder prop is provided', () => {
    const folder = { name: 'Test', description: 'Desc' };
    const wrapper = mount(FolderForm, {
      props: { folder },
    });

    expect(wrapper.text()).toContain('Edit Folder');
    expect(wrapper.find('button[type="submit"]').text()).toBe('Update');
  });

  it('populates form with folder data in edit mode', () => {
    const folder = { name: 'Test Folder', description: 'Test Desc' };
    const wrapper = mount(FolderForm, {
      props: { folder },
    });

    expect(wrapper.find('#name').element.value).toBe('Test Folder');
    expect(wrapper.find('#description').element.value).toBe('Test Desc');
  });

  it('emits submit event with form data', async () => {
    const wrapper = mount(FolderForm);

    await wrapper.find('#name').setValue('New Folder');
    await wrapper.find('#description').setValue('New Description');
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      name: 'New Folder',
      description: 'New Description',
    });
  });

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(FolderForm);

    await wrapper.find('button[type="button"]').trigger('click');

    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('requires name field', () => {
    const wrapper = mount(FolderForm);
    const nameInput = wrapper.find('#name');

    expect(nameInput.attributes('required')).toBeDefined();
  });
});
