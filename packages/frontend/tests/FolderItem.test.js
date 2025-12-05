import { describe, it, expect, beforeEach } from 'bun:test';
import { mount } from '@vue/test-utils';
import FolderItem from '../src/components/FolderItem.vue';

describe('FolderItem', () => {
  const mockFolder = {
    id: '123',
    name: 'Test Folder',
    description: 'Test Description',
  };

  it('renders folder name correctly', () => {
    const wrapper = mount(FolderItem, {
      props: { folder: mockFolder },
    });

    expect(wrapper.text()).toContain('Test Folder');
  });

  it('renders folder description when provided', () => {
    const wrapper = mount(FolderItem, {
      props: { folder: mockFolder },
    });

    expect(wrapper.text()).toContain('Test Description');
  });

  it('does not render description when not provided', () => {
    const folderWithoutDesc = { id: '123', name: 'Test' };
    const wrapper = mount(FolderItem, {
      props: { folder: folderWithoutDesc },
    });

    expect(wrapper.find('.folder-description').exists()).toBe(false);
  });

  it('emits open event when open button is clicked', async () => {
    const wrapper = mount(FolderItem, {
      props: { folder: mockFolder },
    });

    await wrapper.find('.btn-small').trigger('click');

    expect(wrapper.emitted('open')).toBeTruthy();
    expect(wrapper.emitted('open')[0]).toEqual([mockFolder.id]);
  });

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(FolderItem, {
      props: { folder: mockFolder },
    });

    const buttons = wrapper.findAll('.btn-small');
    await buttons[1].trigger('click');

    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')[0]).toEqual([mockFolder]);
  });

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(FolderItem, {
      props: { folder: mockFolder },
    });

    await wrapper.find('.btn-danger').trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')[0]).toEqual([mockFolder.id]);
  });
});
