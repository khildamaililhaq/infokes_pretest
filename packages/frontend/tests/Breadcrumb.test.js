import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Breadcrumb from '../src/components/Breadcrumb.vue';

describe('Breadcrumb', () => {
  it('always renders root button', () => {
    const wrapper = mount(Breadcrumb, {
      props: { breadcrumbs: [] },
    });

    expect(wrapper.text()).toContain('Root');
  });

  it('renders breadcrumb items', () => {
    const breadcrumbs = [
      { id: '1', name: 'Folder 1' },
      { id: '2', name: 'Folder 2' },
    ];

    const wrapper = mount(Breadcrumb, {
      props: { breadcrumbs },
    });

    expect(wrapper.text()).toContain('Folder 1');
    expect(wrapper.text()).toContain('Folder 2');
  });

  it('renders separators between items', () => {
    const breadcrumbs = [{ id: '1', name: 'Folder 1' }];

    const wrapper = mount(Breadcrumb, {
      props: { breadcrumbs },
    });

    expect(wrapper.findAll('.breadcrumb-separator').length).toBe(1);
  });

  it('emits navigate event with null when root is clicked', async () => {
    const wrapper = mount(Breadcrumb, {
      props: { breadcrumbs: [] },
    });

    await wrapper.find('.breadcrumb-item').trigger('click');

    expect(wrapper.emitted('navigate')).toBeTruthy();
    expect(wrapper.emitted('navigate')[0]).toEqual([null]);
  });

  it('emits navigate event with folder id when breadcrumb is clicked', async () => {
    const breadcrumbs = [{ id: '123', name: 'Test Folder' }];

    const wrapper = mount(Breadcrumb, {
      props: { breadcrumbs },
    });

    const items = wrapper.findAll('.breadcrumb-item');
    await items[1].trigger('click');

    expect(wrapper.emitted('navigate')).toBeTruthy();
    expect(wrapper.emitted('navigate')[0]).toEqual(['123']);
  });
});
