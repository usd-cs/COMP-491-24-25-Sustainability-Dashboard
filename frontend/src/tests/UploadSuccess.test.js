/**
 * @file UploadSuccess.test.js
 * @description Unit tests for the `UploadSuccess` component using Vue Test Utils and Vitest.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import UploadSuccess from '../components/UploadSuccess.vue';

/**
 * @description Test suite for the `UploadSuccess` component.
 */
describe('UploadSuccess', () => {
  /**
   * @description Tests if the `UploadSuccess` component renders correctly.
   */
  it('renders correctly', () => {
    const wrapper = mount(UploadSuccess);

    // Verify the main title
    expect(wrapper.find('.title').text()).toBe('USD Office of Sustainability');

    // Verify the success heading and detail message
    expect(wrapper.find('.success-heading').text()).toBe('SUCCESS');
    expect(wrapper.find('.success-detail').text()).toBe('Imported file successfully');
  });

  /**
   * @description Tests if the buttons in the component are accessible and correctly labeled.
   */
  it('has accessible buttons', () => {
    const wrapper = mount(UploadSuccess);

    // Find the cancel and import buttons
    const cancelButton = wrapper.find('.cancel-btn');
    const importButton = wrapper.find('.import-btn');

    // Verify that the buttons exist
    expect(cancelButton.exists()).toBe(true);
    expect(importButton.exists()).toBe(true);

    // Verify the text on the buttons
    expect(cancelButton.text()).toBe('Cancel');
    expect(importButton.text()).toBe('Import');
  });

  /**
   * @description Tests if the component contains the correct success message.
   */
  it('contains success message', () => {
    const wrapper = mount(UploadSuccess);

    // Verify the success heading and detail message
    expect(wrapper.find('.success-heading').text()).toBe('SUCCESS');
    expect(wrapper.find('.success-detail').text()).toBe('Imported file successfully');
  });

  /**
   * @description Tests if the component includes action buttons (cancel and import).
   */
  it('has action buttons', () => {
    const wrapper = mount(UploadSuccess);

    // Verify that the cancel and import buttons exist
    expect(wrapper.find('.cancel-btn').exists()).toBe(true);
    expect(wrapper.find('.import-btn').exists()).toBe(true);
  });
});
