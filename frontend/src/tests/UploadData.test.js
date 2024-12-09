import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import UploadPortal from '../components/UploadData.vue';

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [],
});
vi.spyOn(mockRouter, 'push');

describe('UploadPortal', () => {
  it('renders correctly', () => {
    const wrapper = mount(UploadPortal);
    expect(wrapper.find('.upload-portal').exists()).toBe(true);
    expect(wrapper.find('.title').text()).toBe('USD Office of Sustainability');
  });

  it('handles file selection', async () => {
    const wrapper = mount(UploadPortal);
    const input = wrapper.find('#fileInput');

    // Mock file input change event
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    Object.defineProperty(input.element, 'files', {
      value: [file],
    });
    await input.trigger('change');

    // Add assertions based on expected behavior
    expect(input.element.files[0].name).toBe('test.xlsx');
  });

  it('handles form submission', async () => {
    const wrapper = mount(UploadPortal);
    await wrapper.find('form').trigger('submit');

    // Add assertions based on expected behavior
    expect(wrapper.emitted()).toHaveProperty('submit');
  });

  it('handles cancel action', async () => {
    const wrapper = mount(UploadPortal, {
      global: {
        plugins: [mockRouter],
      },
    });
    await wrapper.find('.cancel-btn').trigger('click');
    expect(mockRouter.push).toHaveBeenCalledWith('/main');
  });

  it('handles logout action', async () => {
    const wrapper = mount(UploadPortal, {
      global: {
        plugins: [mockRouter],
      },
    });
    await wrapper.find('.logout-btn').trigger('click');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
