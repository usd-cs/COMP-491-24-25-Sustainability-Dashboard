import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FileImport from '../components/FileImport.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Main' },
    { path: '/upload', name: 'Upload' }
  ]
});

describe('FileImport.vue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with default selected source', () => {
    const wrapper = mount(FileImport, {
      global: { plugins: [router] }
    });
    expect(wrapper.vm.selectedSource).toBe('Athena');
  });

  it('updates selected source when clicked', async () => {
    const wrapper = mount(FileImport, {
      global: { plugins: [router] }
    });
    
    await wrapper.find('.source-option:nth-child(2)').trigger('click');
    expect(wrapper.vm.selectedSource).toBe('Bloom');
  });

  it('navigates to /upload when submit is clicked', async () => {
    router.push = vi.fn();
    const wrapper = mount(FileImport, {
      global: { plugins: [router] }
    });
    
    await wrapper.find('.source-selector__submit').trigger('click');
    expect(router.push).toHaveBeenCalledWith('/upload');
  });

  it('navigates to /main when cancel is clicked', async () => {
    router.push = vi.fn();
    const wrapper = mount(FileImport, {
      global: { plugins: [router] }
    });
    
    await wrapper.find('.file-import__cancel').trigger('click');
    expect(router.push).toHaveBeenCalledWith('/');
  });
});
