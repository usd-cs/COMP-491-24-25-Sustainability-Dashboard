/**
 * @file UploadData.test.js
 * @description Unit tests for the `UploadData` component using Vitest and Vue Test Utils.
 */

import { mount } from '@vue/test-utils';
import { it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import uploadData from '../components/UploadData.vue';

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
    const wrapper = mount(uploadData, {
        global: {
            plugins: [mockRouter],
        },
    });
    const input = wrapper.find('#fileInput');

    // Mock a file input change event with a test file
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    Object.defineProperty(input.element, 'files', {
      value: [file],
    });

    // Trigger the file selection change event
    await input.trigger('change');

    // Verify the selected file name
    expect(input.element.files[0].name).toBe('test.xlsx');
  });

  /**
   * @description Tests the form submission functionality.
   */
  it('handles form submission', async () => {
    const wrapper = mount(uploadData, {
      global: {
          plugins: [mockRouter],
      },
    });

    // Trigger the form submission
    await wrapper.find('form').trigger('submit');

    // Verify the form submission emitted the `submit` event
    expect(wrapper.emitted()).toHaveProperty('submit');
  });

  /**
   * @description Tests the cancel button navigation functionality.
   */
  it('handles cancel action', async () => {
    const wrapper = mount(uploadData, {
      global: {
        plugins: [mockRouter],
      },
    });

    // Trigger the cancel button click
    await wrapper.find('.cancel-btn').trigger('click');

    // Verify navigation to the main page
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  /**
   * @description Tests the back button navigation functionality.
   */
  it('handles back action', async () => {
    const wrapper = mount(uploadData, {
      global: {
        plugins: [mockRouter],
      },
    });

    // Trigger the back button click
    await wrapper.find('.back-btn').trigger('click');

    // Verify navigation to the file selection page
    expect(mockRouter.push).toHaveBeenCalledWith('/select');
  });
