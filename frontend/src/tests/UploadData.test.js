/**
 * @file UploadPortal.test.js
 * @description Unit tests for the `UploadPortal` component using Vitest and Vue Test Utils.
 */

import { mount } from '@vue/test-utils';
import { it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import UploadPortal from '../components/UploadData.vue';

// Create a mock Vue Router instance
const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [],
});

// Spy on the router's `push` method to verify navigation
vi.spyOn(mockRouter, 'push');


  /**
   * @description Tests the file selection functionality.
   */
  it('handles file selection', async () => {
    const wrapper = mount(UploadPortal, {
      global: {
        plugins: [mockRouter],
        mocks: {
          $route: {
            path: '/upload',
          },
        },
      },
    });
  
    const input = wrapper.find('#fileInput');
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  
    Object.defineProperty(input.element, 'files', {
      value: [file],
    });
  
    await input.trigger('change');
    expect(input.element.files[0].name).toBe('test.xlsx');
  });


  /**
   * @description Tests the cancel button navigation functionality.
   */
  it('handles cancel action', async () => {
    const wrapper = mount(UploadPortal, {
      global: {
        plugins: [mockRouter],
      },
    });

    // Trigger the cancel button click
    await wrapper.find('.cancel-btn').trigger('click');

    // Verify navigation to the main page
    expect(mockRouter.push).toHaveBeenCalledWith('/main');
  });

  /**
   * @description Tests the logout button navigation functionality.
   */
  it('handles logout action', async () => {
    const wrapper = mount(UploadPortal, {
      global: {
        plugins: [mockRouter],
      },
    });

    // Trigger the logout button click
    await wrapper.find('.logout-btn').trigger('click');

    // Verify navigation to the login page
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
