import { describe, it, expect } from 'bun:test';
import { mount } from '@vue/test-utils';
import FileItem from '../src/components/FileItem.vue';

describe('FileItem', () => {
  const mockFile = {
    id: '456',
    name: 'test',
    extension: 'txt',
    size: 1024,
  };

  it('renders file name correctly', () => {
    const wrapper = mount(FileItem, {
      props: { file: mockFile },
    });

    expect(wrapper.text()).toContain('test');
  });

  it('renders file extension when provided', () => {
    const wrapper = mount(FileItem, {
      props: { file: mockFile },
    });

    expect(wrapper.text()).toContain('.txt');
  });

  it('formats file size correctly', () => {
    const wrapper = mount(FileItem, {
      props: { file: mockFile },
    });

    expect(wrapper.text()).toContain('1 KB');
  });

  it('formats zero size correctly', () => {
    const fileWithZeroSize = { ...mockFile, size: 0 };
    const wrapper = mount(FileItem, {
      props: { file: fileWithZeroSize },
    });

    expect(wrapper.text()).toContain('0 B');
  });

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(FileItem, {
      props: { file: mockFile },
    });

    await wrapper.find('.btn-small').trigger('click');

    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')[0]).toEqual([mockFile]);
  });

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(FileItem, {
      props: { file: mockFile },
    });

    await wrapper.find('.btn-danger').trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')[0]).toEqual([mockFile.id]);
  });
});
